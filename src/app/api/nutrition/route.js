import { NextResponse } from "next/server";

export async function GET(request) {
    const query =
        request.nextUrl.searchParams.get("q")?.trim();

    if (!query) {
        return NextResponse.json(
            {
                error: "A drink name is required.",
            },
            {
                status: 400,
            },
        );
    }

    if (query.length > 80) {
        return NextResponse.json(
            {
                error: "The nutrition query is too long.",
            },
            {
                status: 400,
            },
        );
    }

    try {
        const url = new URL(
            "https://api.nal.usda.gov/fdc/v1/foods/search",
        );

        url.searchParams.set(
            "api_key",
            process.env.USDA_API_KEY || "DEMO_KEY",
        );
        url.searchParams.set("query", query);
        url.searchParams.set("pageSize", "1");

        const response = await fetch(url, {
            next: {
                revalidate: 86400,
            },
        });

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        const food = data.foods?.[0];

        if (!food) {
            return NextResponse.json({
                nutrition: null,
            });
        }

        return NextResponse.json({
            nutrition: {
                matchedFood: food.description,
                servingNote:
                    "Values per 100 g of the closest USDA match",
                calories: nutrient(
                    food,
                    ["Energy"],
                    "KCAL",
                ),
                carbohydrates: nutrient(food, [
                    "Carbohydrate, by difference",
                ]),
                sugar: nutrient(food, [
                    "Sugars, Total NLEA",
                    "Total Sugars",
                ]),
                protein: nutrient(food, [
                    "Protein",
                ]),
            },
        });
    } catch {
        return NextResponse.json(
            {
                error:
                    "Nutrition information is temporarily unavailable.",
            },
            {
                status: 502,
            },
        );
    }
}

function nutrient(food, names, preferredUnit) {
    const item = food.foodNutrients?.find(
        (entry) =>
            names.includes(entry.nutrientName) &&
            (!preferredUnit ||
                entry.unitName === preferredUnit),
    );

    if (!item || item.value == null) {
        return "Not available";
    }

    const value =
        Math.round(item.value * 10) / 10;

    return `${value} ${item.unitName.toLowerCase()}`;
}
