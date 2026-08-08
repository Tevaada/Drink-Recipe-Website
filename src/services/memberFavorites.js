import { createClient } from "@/lib/supabase/client";
import { clearFavorites, getFavorites,} from "@/services/favorites";

function normalizeFavorite(row) {
    return {
        id: row.drink_id,
        title: row.drink_name,
        image:
            row.drink_image ||
            "/images/drink-placeholder.svg",
        category:
            row.category ||
            "Saved drink",
        description:
            "Open this saved recipe to view its ingredients and instructions.",
        alcoholic: "Saved drink",
        glass: "Recipe",
    };
}

export async function getMemberFavorites() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            authenticated: false,
            favorites: [],
        };
    }

    const { data, error } = await supabase
        .from("favorites")
        .select(
            "drink_id, drink_name, drink_image, category",
        )
        .eq("user_id", user.id)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw new Error(
            "Your member favorites could not be loaded.",
        );
    }

    return {
        authenticated: true,
        favorites: (data || []).map(normalizeFavorite),
    };
}

export async function isMemberFavorite(recipeId) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            authenticated: false,
            saved: false,
        };
    }

    const { data, error } = await supabase
        .from("favorites")
        .select("drink_id")
        .eq("user_id", user.id)
        .eq("drink_id", recipeId)
        .maybeSingle();

    if (error) {
        throw new Error(
            "The favorite status could not be checked.",
        );
    }

    return {
        authenticated: true,
        saved: Boolean(data),
    };
}

export async function toggleMemberFavorite(recipe) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            authenticated: false,
            saved: false,
        };
    }

    const status = await isMemberFavorite(recipe.id);

    if (status.saved) {
        const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("drink_id", recipe.id);

        if (error) {
            throw new Error(
                "The favorite could not be removed.",
            );
        }

        return {
            authenticated: true,
            saved: false,
        };
    }

    const { error } = await supabase
        .from("favorites")
        .insert({
            user_id: user.id,
            drink_id: recipe.id,
            drink_name: recipe.title,
            drink_image: recipe.image,
            category: recipe.category,
        });

    if (error) {
        throw new Error(
            "The favorite could not be saved.",
        );
    }

    return {
        authenticated: true,
        saved: true,
    };
}

export async function migrateGuestFavorites() {
    const guestFavorites = getFavorites();

    if (guestFavorites.length === 0) {
        return {
            migrated: 0,
        };
    }

    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            migrated: 0,
        };
    }

    const databaseRows = guestFavorites.map(
        (recipe) => ({
            user_id: user.id,
            drink_id: recipe.id,
            drink_name: recipe.title,
            drink_image: recipe.image,
            category: recipe.category,
        }),
    );

    const { error } = await supabase
        .from("favorites")
        .upsert(databaseRows, {
            onConflict: "user_id,drink_id",
        });

    if (error) {
        throw new Error(
            "Your guest favorites could not be moved to your account.",
        );
    }

    clearFavorites();

    return {
        migrated: databaseRows.length,
    };
}
