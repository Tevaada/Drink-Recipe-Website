export async function searchDrinks(query = "") {
    const trimmedQuery = query.trim();

    const url = trimmedQuery
        ? `/api/drinks?q=${encodeURIComponent(trimmedQuery)}`
        : "/api/drinks";

    let response;

    try {
        response = await fetch(url);
    } catch {
        throw new Error(
        "Unable to connect to the drink service.",
        );
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
        data.error || "Unable to load drink recipes.",
        );
    }

    return data.drinks ?? [];
}
export async function getDrinkById(id) {
    if (!id) {
        throw new Error("A drink ID is required.");
    }

    const url =
        `/api/drinks/${encodeURIComponent(id)}`;

    let response;

    try {
        response = await fetch(url);
    } catch {
        throw new Error(
        "Unable to connect to the drink service.",
        );
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
        data.error || "Unable to load the drink recipe.",
        );
    }

    if (!data.drink) {
        throw new Error("Drink recipe not found.");
    }

    return data.drink;
}