export function normalizeDrink(drink) {
    const ingredients = [];

    for (let index = 1; index <= 15; index += 1) {
        
        const name = drink[`strIngredient${index}`]?.trim();
        const amount = drink[`strMeasure${index}`]?.trim();

        if (name) {
            ingredients.push({
                name,
                amount: amount || "As needed",
            });
        }
    }

    return {
        id: drink.idDrink,
        title: drink.strDrink,
        image: drink.strDrinkThumb,
        category: drink.strCategory || "Other drinks",
        alcoholic: drink.strAlcoholic || "Unknown",
        glass: drink.strGlass || "Any glass",
        instructions:
        drink.strInstructions ||
        "Instructions are unavailable.",
        ingredients,
        description:
        drink.strInstructions?.slice(0, 150) ||
        "Explore this drink recipe and its ingredients.",
    };
}