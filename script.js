document
    .getElementById("btn-search")
    .addEventListener("click", function (event) {
        event.preventDefault();

        const searchInput = document
            .getElementById("search-field")
            .value.toLowerCase();

        const mealContainer = document.getElementById("meal-container");

        mealContainer.innerHTML = "";

        searchMeal(searchInput, mealContainer);
    });

const searchMeal = (searchInput, mealContainer) => {
    const spinner = document.getElementById("loading-spinner");
    spinner.classList.remove("d-none");
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchInput}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.meals) {
                data.meals.forEach((meal) => {
                    const mealCard = `
                        <div class="col col-md-3">
                            <div class="card px-0 shadow mb-4 pointer" data-id="${meal.idMeal}">
                                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                                <div class="card-body">
                                    <h5 class="card-title fw-bold text-primary">${meal.strMeal}</h5>
                                    <div class="d-flex justify-content-lg-between fw-medium">
                                        <p class="card-text"><span class="fst-italic">Category: </span> ${meal.strCategory}</p>
                                        <p class="card-text"><span class="fst-italic">Country: </span> ${meal.strArea}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    mealContainer.innerHTML += mealCard;
                });
                document.querySelectorAll(".card").forEach((card) => {
                    card.addEventListener("click", function () {
                        const mealId = this.getAttribute("data-id");
                        showMealDetails(mealId);
                    });
                });
            } else {
                mealContainer.innerHTML =
                    '<p class="text-center fs-4 fw-bold text-danger">No Meal Found!!!</p>';
            }
        })
        .catch((error) => {
            mealContainer.innerHTML =
                '<p class="text-center fs-4 fw-bold text-danger">Fail to Fetch Meals!!!</p>';
        })
        .finally(() => {
            spinner.classList.add("d-none");
        });
};

const showMealDetails = (mealId) => {
    const mealDetails = document.getElementById("meal-details");
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];

            let ingredientList = "";
            for (let i = 1; i <= 10; i++) {
                if (meal[`strIngredient${i}`] != "") {
                    let ingredient = meal[`strIngredient${i}`];
                    ingredientList += `<li>${ingredient}</li>`;
                }
            }

            mealDetails.innerHTML = `
                <div class="col col-md-6">
                    <div class="card px-0 shadow mb-4">
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-primary">${meal.strMeal}</h5>
                            <div class="fw-medium">
                                <h3 class="fw-bold fs-5">Ingredients:</h3>
                                <ul class="ps-4">
                                    ${ingredientList}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
};
