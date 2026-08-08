    import { NextResponse } from "next/server";
    import { normalizeDrink } from "@/lib/drinks";

    const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php";
    const DEFAULT_SEARCH_PAGES = [
        ["mojito", "margarita", "lemonade", "coffee"],
        ["gin", "vodka", "rum", "tequila"],
        ["whiskey", "brandy", "champagne", "beer"],
        ["lime", "orange", "pineapple", "coconut"],
    ];

    export async function GET(request) {
    const query = request.nextUrl.searchParams.get("q")?.trim();
    const requestedPage = Number(
        request.nextUrl.searchParams.get("page") || "1",
    );

    if (query && query.length > 80) {
            return NextResponse.json(
            {
                error: "The search query is too long.",
            },
            {
                status: 400,
            },
        );
    }

    if (
        !Number.isInteger(requestedPage) ||
        requestedPage < 1 ||
        requestedPage > DEFAULT_SEARCH_PAGES.length
    ) {
        return NextResponse.json(
            { error: "The requested recipe page is invalid." },
            { status: 400 },
        );
    }

    const searchTerms = query
        ? [query]
        : DEFAULT_SEARCH_PAGES[requestedPage - 1];

    try {
        const responses = await Promise.allSettled(
            searchTerms.map((term) =>
                fetch(
                    `${API_URL}?s=${encodeURIComponent(term)}`,
                    {
                        next: {
                            revalidate: 3600,
                        },
                    },
                ),
            ),
        );

        const successfulResponses = responses
            .filter(
                (result) =>
                    result.status === "fulfilled" &&
                    result.value.ok,
            )
            .map((result) => result.value);

        if (successfulResponses.length === 0) {
            throw new Error("TheCocktailDB request failed.");
        }

        const payloads = await Promise.all(
            successfulResponses.map((response) => response.json()),
        );

        const uniqueDrinks = new Map();

        payloads
            .flatMap((payload) => payload.drinks ?? [])
            .forEach((drink) => {
            uniqueDrinks.set(drink.idDrink, drink);
        });

        const drinks = [...uniqueDrinks.values()]
            .slice(0, 24)
            .map(normalizeDrink);

        return NextResponse.json({
            drinks,
            page: requestedPage,
            hasMore:
                !query &&
                requestedPage < DEFAULT_SEARCH_PAGES.length,
        });
    } catch {
        return NextResponse.json(
            {
                error: "Drink recipes are temporarily unavailable.",
            },
            {
                status: 502,
            },
        );
    }
}
