import { NextResponse } from "next/server";
import { normalizeDrink } from "@/lib/drinks";

const LOOKUP_URL ="https://www.thecocktaildb.com/api/json/v1/1/lookup.php";

export async function GET(request, { params }) {
    const { id } = await params;

    if (!/^\d+$/.test(id)) {
        return NextResponse.json(
        {
            error: "The drink ID is invalid.",
        },
        {
            status: 400,
        },
        );
    }

    try {
        const response = await fetch(
        `${LOOKUP_URL}?i=${encodeURIComponent(id)}`,
        {
            next: {
            revalidate: 3600,
            },
        },
        );

        if (!response.ok) {
        throw new Error("TheCocktailDB request failed.");
        }

        const data = await response.json();
        const externalDrink = data.drinks?.[0];

        if (!externalDrink) {
        return NextResponse.json(
            {
            error: "Drink recipe not found.",
            },
            {
            status: 404,
            },
        );
        }

        return NextResponse.json({
        drink: normalizeDrink(externalDrink),
        });
    } catch {
        return NextResponse.json(
        {
            error: "The drink recipe is temporarily unavailable.",
        },
        {
            status: 502,
        },
        );
    }
}