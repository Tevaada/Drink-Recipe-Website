export async function loadDrinks(query = "", page = 1) {
    const trimmedQuery = query.trim();

    const url = trimmedQuery
        ? `/api/drinks?q=${encodeURIComponent(trimmedQuery)}`
        : `/api/drinks?page=${page}`;

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

    return {
        drinks: data.drinks ?? [],
        page: data.page ?? page,
        hasMore: Boolean(data.hasMore),
    };
}

export async function searchDrinks(query = "") {
    const result = await loadDrinks(query, 1);
    return result.drinks;
}
