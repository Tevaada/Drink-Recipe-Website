    import { NextResponse } from "next/server";
    import { normalizeDrink } from "@/lib/drinks";

    const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php";

    export async function GET(request) {
    const query = request.nextUrl.searchParams.get("q")?.trim();

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

    const searchTerms = query ? [query] : ["mojito", "margarita", "lemonade", "coffee"];

    try {
        const responses = await Promise.all(
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

        const failedRequest = responses.some(
            (response) => !response.ok,
        );

        if (failedRequest) {
            throw new Error("TheCocktailDB request failed.");
        }

        const payloads = await Promise.all(
            responses.map((response) => response.json()),
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
