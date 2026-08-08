import test from "node:test";
import assert from "node:assert/strict";
import { normalizeDrink } from "../src/lib/drinks.js";
import { getInstructionSteps } from "../src/lib/instructions.js";
import {
    DEFAULT_SEARCH_PAGES,
    getCatalogTerms,
} from "../src/lib/drinkCatalog.js";

test("normalizeDrink collects populated ingredients", () => {
    const drink = normalizeDrink({
        idDrink: "1",
        strDrink: "Test drink",
        strIngredient1: " Lime ",
        strMeasure1: " 2 slices ",
        strIngredient2: "Ice",
        strInstructions: "Mix. Serve.",
    });

    assert.equal(drink.title, "Test drink");
    assert.deepEqual(drink.ingredients, [
        { name: "Lime", amount: "2 slices" },
        { name: "Ice", amount: "As needed" },
    ]);
});

test("instructions become clean numbered steps", () => {
    assert.deepEqual(
        getInstructionSteps("Mix ingredients.\nServe cold!"),
        ["Mix ingredients.", "Serve cold!"],
    );
    assert.deepEqual(
        getInstructionSteps(""),
        ["Instructions are unavailable."],
    );
});

test("catalog pages are bounded", () => {
    assert.deepEqual(getCatalogTerms(1), DEFAULT_SEARCH_PAGES[0]);
    assert.equal(getCatalogTerms(0), null);
    assert.equal(
        getCatalogTerms(DEFAULT_SEARCH_PAGES.length + 1),
        null,
    );
});
