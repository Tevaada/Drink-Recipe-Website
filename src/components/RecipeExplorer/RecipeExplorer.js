"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard/RecipeCard";
import { searchDrinks } from "@/services/drinks";
import styles from "./RecipeExplorer.module.css";

export default function RecipeExplorer({initialCategory = "all",}) {
    
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [activeQuery, setActiveQuery] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadRecipes() {
            try {
                setIsLoading(true);
                setError("");

                const drinks = await searchDrinks();

                if (!ignore) {
                    setRecipes(drinks);
                }
            } catch (requestError) {
                if (!ignore) {
                    setError(requestError.message);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadRecipes();

        return () => {
            ignore = true;
        };
    }, []);

    async function handleSearch(event) {
        event.preventDefault();
        await loadSearchResults(query);
    }

    async function handleReset() {
        setQuery("");
        setSelectedCategory("all");
        await loadSearchResults("");
    }
    
    async function loadSearchResults(searchQuery) {
        try {
            setIsLoading(true);
            setError("");

            const drinks = await searchDrinks(searchQuery);

            setRecipes(drinks);
            setSelectedCategory("all");
            setActiveQuery(searchQuery.trim());
        } catch (requestError) {

            setError(requestError.message);
            setRecipes([]);
            
        } finally {
            setIsLoading(false);
        }
    }
    const categories = [...new Set(recipes.map((recipe) => recipe.category).filter(Boolean),),].sort();
    const filteredRecipes = selectedCategory === "all" ? recipes : recipes.filter((recipe) => recipe.category === selectedCategory,);
    
    return (
        <section className={styles.recipeSection} aria-labelledby="all-recipes-title">
            <div className={styles.sectionHeading}>
                <h2 id="all-recipes-title" className={styles.sectionTitle}>
                    All recipes
                </h2>
                
                <span className={styles.recipeCount}>
                    {filteredRecipes.length} recipes
                </span>
            </div>

            <form className={styles.searchForm} onSubmit={handleSearch}>
                <label htmlFor="drink-search">
                    Search for a drink
                </label>

                <div className={styles.searchControls}>
                    <input id="drink-search" className={styles.searchInput} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try coffee, mojito, or lemonade" maxLength={80}/>
                    
                    <button type="submit" className={styles.searchButton} disabled={isLoading}>
                        {isLoading ? "Searching..." : "Search"}
                    </button>

                    <button type="button" className={styles.resetButton} onClick={handleReset} disabled={isLoading}>
                        Reset
                    </button>
                </div>
            </form>
            <div className={styles.filterToolbar}>
                <label htmlFor="category-filter">
                    Category
                </label>

                <select id="category-filter" className={styles.categorySelect} value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                    <option value="all">
                        All categories
                    </option>

                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            {activeQuery && !isLoading && !error && (
                <p className={styles.searchSummary}>
                    Showing results for{" "}
                    <strong>&ldquo;{activeQuery}&rdquo;</strong>
                </p>
            )}


            {isLoading ? (
                <div className={styles.status} role="status">
                    Loading drink recipes...
                </div>
            ) : error ? (
                <div className={styles.error} role="alert">
                    <h2>Unable to load recipes</h2>
                    <p>{error}</p>

                    <button type="button" className={styles.retryButton} onClick={() => loadSearchResults(activeQuery)}>
                        Try again
                    </button>
                </div>
            ) : filteredRecipes.length === 0 ? (
                <div className={styles.status}>
                    {selectedCategory !== "all"
                        ? `No recipes match the ${selectedCategory} category.`
                        : activeQuery
                            ? `No recipes were found for "${activeQuery}".`
                            : "No drink recipes were found."}
                </div>
            ) : (
            <div className={styles.recipeGrid}>
                {filteredRecipes.map((recipe) => (<RecipeCard key={recipe.id} recipe={recipe}/>))}
            </div>
            )}
        </section>
    );
}