"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function saveProfile(supabase, user) {
    const metadata = user.user_metadata || {};

    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            display_name:
                metadata.display_name ||
                user.email?.split("@")[0] ||
                "Member",
            wellness_goal:
                metadata.wellness_goal ||
                "Explore drinks",
            updated_at: new Date().toISOString(),
        });

    return error;
}


export async function signUpAccount(values) {
    const name = values.name?.trim();
    const email = values.email?.trim();
    const password = values.password;
    const focusGoal =
        values.focusGoal || "Explore drinks";

    if (!name) {
        return {
            error: "Please enter your name.",
        };
    }

    if (!email) {
        return {
            error: "Please enter your email address.",
        };
    }

    if (!password || password.length < 6) {
        return {
            error:
                "Your password must contain at least 6 characters.",
        };
    }

    const supabase = await createClient();

    const { data, error } =
        await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: name,
                    wellness_goal: focusGoal,
                },
            },
        });

    if (error) {
        return {
            error: error.message,
        };
    }

    if (data.session && data.user) {
    const profileError =
        await saveProfile(supabase, data.user);

    if (profileError) {
        return {
            error:
                "Your account was created, but the profile could not be saved.",
        };
    }
}

    return {
        success: true,
        needsEmailConfirmation: !data.session,
        message: data.session
            ? "Your account was created successfully."
            : "Account created. Check your email to confirm your account.",
    };
}

export async function loginAccount(values) {
    const email = values.email?.trim();
    const password = values.password;

    if (!email) {
        return {
            error: "Please enter your email address.",
        };
    }

    if (!password) {
        return {
            error: "Please enter your password.",
        };
    }

    const supabase = await createClient();

    const { data, error } =
    await supabase.auth.signInWithPassword({
            email,
            password,
        });

    if (error) {
        return {
            error: "The email or password is incorrect.",
        };
    }
    
    if (data.user) {
    const profileError =
        await saveProfile(supabase, data.user);

    if (profileError) {
        return {
            error:
                "You logged in, but your profile could not be saved.",
        };
    }
}

    return {
        success: true,
        message: "You logged in successfully.",
    };
}

export async function updateProfile(values) {
    const displayName = values.displayName?.trim();
    const wellnessGoal = values.wellnessGoal;

    const allowedGoals = [
        "Explore drinks",
        "Focus",
        "Recovery",
        "Hydration",
        "Alcohol-free",
    ];

    if (!displayName) {
        return {
            error: "Please enter your name.",
        };
    }

    if (displayName.length > 80) {
        return {
            error: "Your name must be 80 characters or fewer.",
        };
    }

    if (!allowedGoals.includes(wellnessGoal)) {
        return {
            error: "Please select a valid interest.",
        };
    }

    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            error: "You must be logged in to update your profile.",
        };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            display_name: displayName,
            wellness_goal: wellnessGoal,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        return {
            error: "Your profile could not be updated.",
        };
    }

    revalidatePath("/member");

    return {
        success: true,
        message: "Your profile was updated successfully.",
    };
}

export async function logoutAccount() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return {
            error: "Unable to log out. Please try again.",
        };
    }

    revalidatePath("/", "layout");

    return {
        success: true,
    };
}
