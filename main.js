window.addEventListener("load", function () {  //to execute the code after page loaded

    const MAIN_INGREDIENTS = ["steak", "chicken", "fish", "pasta", "pizza", "cake"];  //6
    const CONDIMENTS = ["tomato", "eggs", "oil", "butter", "sugar", "salt", "yeast", "potatoes", "carrots", "milk", "water", "flour", "cheese", "vinegar", "lemon", "cream"];  //16
    const ALL_INGREDIENTS = MAIN_INGREDIENTS.concat(CONDIMENTS);

    const RECIPE_BOOK_SIZE = 2;
    const MIN_CONDIMENTS = 3;
    const MAX_CONDIMENTS = 6;
    const N_INGREDIENTS = 5;

    var kitchenEl1 = document.getElementsByClassName("kitchen")[0];
    var kitchenEl2 = kitchenEl1.cloneNode(true);
    kitchenEl1.parentNode.insertBefore(kitchenEl2, kitchenEl1.nextSibling);

    var kitchens = [
        new Kitchen(kitchenEl1),
        new Kitchen(kitchenEl2)
    ];
    var currentPlayer;
    setCurrentPlayer( selectItem(kitchens) );

    function setCurrentPlayer(kitchen) {
        currentPlayer = kitchen;
        kitchens.filter(k => k!==currentPlayer)
                .forEach(k => k.resetPlayerMark());
        currentPlayer.setPlayerMark();
    }

    /**
     * @param {HTMLElement} el 
     */
    function Kitchen(el) {
        var recipesBook = new RecipesBook(el.querySelector(".recipes"));
        var pan = new Pan(el.querySelector(".pan"));
        var playerMarkEl = el.querySelector(".player-mark");

        this.writeRecipes = function(recipes) {
            recipesBook.addSome(recipes || generateRecipes());
        };

        this.getPan = function() {
            return pan;
        };

        this.setPlayerMark = function() {
            playerMarkEl.classList.add("current");
        };
        this.resetPlayerMark = function() {
            playerMarkEl.classList.remove("current");
        };

        this.writeRecipes();
    }

    function RecipesBook(el) {
        var recipesBook = [];

        this.add = function(recipe) {
            recipesBook.push(recipe);
            el.appendChild( recipeHTML(recipe) );
        };
        this.addSome = function(recipes) {
            recipesBook = recipesBook.concat(recipes);
            recipes.map(recipeHTML).forEach(li => el.appendChild(li));
        };
    }

    function Pan(el) {
        var pan = [];
        var outlet = el.querySelector("pre");

        this.addIngredient = function(ingredient) {
            pan.push(ingredient);
            outlet.textContent += "\n" + ingredient.toLowerCase();
        };
    }
    
    function IngredientsTray() {
        var ingredientsTrayEl = document.getElementById("ingredients");

        this.fill = function(number) {
            number = number || N_INGREDIENTS;
            var ingredients = selectNItems(number, ALL_INGREDIENTS);
            ingredients.map(ingredientHTML).forEach(item => item.appendTo(ingredientsTrayEl));
        };
    }

    function Ingredient(ingredient) {
        var el = document.createElement("div");
        el.className = "ingredient";

        var span = document.createElement("span");
        span.textContent = ingredient[0].toUpperCase() + ingredient.slice(1);
        el.appendChild(span);

        el.addEventListener("click", function() {
            currentPlayer.getPan().addIngredient(ingredient);
            el.remove();

            // check recipes => assign points, remove ingredients, ...

            switchTurn();
        });

        /**
         * 
         * @param {HTMLElement} parent 
         */
        this.appendTo = function(parent) {
            parent.appendChild(el);
        };
    }

    var ingredientsTray = new IngredientsTray();
    ingredientsTray.fill();

    // INGREDIENTS
    function ingredientHTML(ingredient) {
        return new Ingredient(ingredient);
    }
    function switchTurn() {
        var currentPlayerIndex = kitchens.indexOf(currentPlayer);
        setCurrentPlayer(kitchens[ (currentPlayerIndex+1) % kitchens.length ]);
    }

    // RECIPES - OUTPUT
    function recipeHTML(recipe) {
        var el = document.createElement("li");

        var main = document.createElement("h3");
        main.textContent = recipe[0];
        el.appendChild(main);

        var condiments = condimentsHTML(recipe.slice(1));
        el.appendChild(condiments);

        return el;
    }
    function condimentsHTML(condiments) {
        return createUL(condiments, createLI);
    }
    function createUL(array, mkLI) {
        var el = document.createElement("ul");
        array.map(mkLI).forEach(li => el.appendChild(li));
        return el;
    }

    /**
     * Creates a LI element wrapping the passed textContent.
     * @param {string} textContent 
     * @returns {HTMLLIElement}
     */
    function createLI(textContent) {
        let li = document.createElement("li");
        li.textContent = textContent;
        return li;
    }

    // RECIPES - GENERATION
    function generateRecipes() {
        var recipes = [];
        for (let i = 0; i < RECIPE_BOOK_SIZE; i++) {
            recipes.push(generateRecipe(MAIN_INGREDIENTS, CONDIMENTS));
        }
        return recipes;
    }
    function generateRecipe(MAIN_INGREDIENTS, condiments, nCondiments) {
        nCondiments = nCondiments || random(MIN_CONDIMENTS, MAX_CONDIMENTS);
        var mainIngridient = selectItem(MAIN_INGREDIENTS);
        var selectedCondiments = extractNItems(nCondiments, condiments);
        return [mainIngridient, ...selectedCondiments];
    }

    // RANDOM
    function selectNItems(n, items) {
        var selected = [];
        for (let i = 0; i < n; i++) {
            selected.push(selectItem(items));
        }
        return selected;
    }
    function selectItem(items) {
        return items[random(0, items.length - 1)];
    }
    function extractNItems(n, items) {
        items = items.slice();
        var selected = [];
        for (let i = 0; i < n; i++) {
            selected.push(extractItem(items));
        }
        return selected;
    }
    function extractItem(items) {
        return items.splice(random(0, items.length - 1), 1)[0];
    }
    function random(min, max) {
        return min + Math.random() * (max - min + 1) | 0; // Math.floor( ... )
    }
});


String.prototype.capitalize = function() {
    return this[0].toUpperCase() + this.slice(1);
};
