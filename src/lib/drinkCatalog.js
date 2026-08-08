export const DEFAULT_SEARCH_PAGES = [
    ["mojito", "margarita", "lemonade", "coffee"],
    ["gin", "vodka", "rum", "tequila"],
    ["whiskey", "brandy", "champagne", "beer"],
    ["lime", "orange", "pineapple", "coconut"],
];

export function getCatalogTerms(page) {
    if (
        !Number.isInteger(page) ||
        page < 1 ||
        page > DEFAULT_SEARCH_PAGES.length
    ) {
        return null;
    }

    return DEFAULT_SEARCH_PAGES[page - 1];
}
