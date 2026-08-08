import "server-only";

import { normalizeDrink } from "@/lib/drinks";

const LOOKUP_URL =
    "https://www.thecocktaildb.com/api/json/v1/1/lookup.php";

export async function fetchDrinkById(id) {
    if (!id || !/^\d+$/.test(id)) {
        return null;
    }

    const response = await fetch(
        `${LOOKUP_URL}?i=${encodeURIComponent(id)}`,
        {
            next: {
                revalidate: 3600,
            },
        },
    );

    if (!response.ok) {
        throw new Error(
            "TheCocktailDB request failed.",
        );
    }

    const data = await response.json();
    const externalDrink = data.drinks?.[0];

    if (!externalDrink) {
        return null;
    }

    return normalizeDrink(externalDrink);
}