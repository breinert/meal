const get_random_btn = document.getElementById('get_random');
const meal_container = document.getElementById('meal');
const get_category_btn = document.getElementById('go');

get_random_btn.addEventListener('click', () => {
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  .then(res => res.json())
  .then(res => {
    createMeal(res.meals[0]);
  })
  .catch(e => {
    console.warn(e);
  });
});

get_category_btn.addEventListener('click', () => {
  let category = document.getElementById('get_category').value;
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  .then(res => res.json())
  .then(res => {
    let mealNum = randomIntFromInterval(0, res.meals.length);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${res.meals[mealNum].idMeal}`)
    .then(res => res.json())
    .then(res => {
      createMeal(res.meals[0]);
    })
    .catch(e => {
      console.warn(e);
    })
  })
  .catch(e => {
    console.warn(e);
  });
})

const createMeal = meal => {
  const ingredients = [];

  //Get all ingredients from the object. Up to 20
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      // Stop if there are no more ingredients
      break;
    }
  }

  const newInnerHTML = `
    <div class="row">
      <div class="columns five">
        <img src="${meal.strMealThumb}" alt="Meal Image">
        ${
            meal.strCategory
              ? `<p><strong>Category:</strong> ${meal.strCategory}</p>`
              : ''
        }
        ${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ''}
        ${
            meal.strTags
              ? `<p><strong>Tags:</strong> ${meal.strTags
                  .split(',')
                  .join(', ')}</p>`
              : ''
        }
        <h5>Ingredients:</h5>
        <ul>
          ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
      <div class="columns seven">
        <h4>${meal.strMeal}</h4>
        <p>${meal.strInstructions}</p>
      </div>
    </div>
    ${
        meal.strYoutube
          ? `
          <div class="row">
            <h5>Video Recipe</h5>
            <div class="videoWrapper">
              <iframe width="420" height="315"
              src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}">
              </iframe>
            </div>
          </div>`
            : ''
      }
    `;

    meal_container.innerHTML = newInnerHTML;
};
// function from: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
