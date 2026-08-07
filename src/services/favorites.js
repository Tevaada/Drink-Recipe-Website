const STORAGE_KEY = "drink_recipe_favorites";

export function getFavorites() {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const storedValue =
        localStorage.getItem(STORAGE_KEY);

        if (!storedValue) {
        return [];
        }

        const favorites = JSON.parse(storedValue);

        return Array.isArray(favorites)
        ? favorites
        : [];
    } catch {
        return [];
    }
    }

export function isFavorite(recipeId) {
    return getFavorites().some(
        (recipe) => recipe.id === recipeId,
    );
}

export function toggleFavorite(recipe) {
    const favorites = getFavorites();

    const alreadySaved = favorites.some(
        (item) => item.id === recipe.id,
    );

    const updatedFavorites = alreadySaved
        ? favorites.filter(
            (item) => item.id !== recipe.id,
        )
        : [...favorites, recipe];

    try {
        localStorage.setItem( STORAGE_KEY, JSON.stringify(updatedFavorites));
        window.dispatchEvent( new Event("favoriteschange") , );
        
    } catch {
        throw new Error(
            "Favorites could not be saved in this browser.",
        );
    }
    return {
        saved: !alreadySaved,
        favorites: updatedFavorites,
    };
}