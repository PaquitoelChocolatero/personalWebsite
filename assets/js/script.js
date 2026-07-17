'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterFunc = function (selectedValue) {

  const items = document.querySelectorAll("[data-filter-item]");

  for (let i = 0; i < items.length; i++) {

    if (selectedValue === "all") {
      items[i].classList.add("active");
    } else {
      const cats = items[i].dataset.category.split(",").map(function (c) { return c.trim(); });
      if (cats.indexOf(selectedValue) !== -1) {
        items[i].classList.add("active");
      } else {
        items[i].classList.remove("active");
      }
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    var clickedLink = this;

    for (let j = 0; j < pages.length; j++) {
      if (clickedLink.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
      } else {
        pages[j].classList.remove("active");
      }
    }

    navigationLinks.forEach(function (link) { link.classList.remove("active"); });
    clickedLink.classList.add("active");
    window.scrollTo(0, 0);
  });
}



// recipe modal variables
const recipeModalContainer = document.querySelector("[data-recipe-modal-container]");
const recipeModalCloseBtn = document.querySelector("[data-recipe-modal-close-btn]");
const recipeOverlay = document.querySelector("[data-recipe-overlay]");
const recipeImg = document.querySelector("[data-recipe-img]");
const recipeTitle = document.querySelector("[data-recipe-title]");
const recipeLink = document.querySelector("[data-recipe-link]");
const recipeServings = document.querySelector("[data-recipe-servings]");
const recipeIngredients = document.querySelector("[data-recipe-ingredients]");
const recipeProcedure = document.querySelector("[data-recipe-procedure]");

const recipeModalFunc = function () {
  recipeModalContainer.classList.toggle("active");
  recipeOverlay.classList.toggle("active");
}

const recipeList = document.querySelector(".recipies .project-list");

async function loadRecipes() {
  try {
    const res = await fetch("recipies/index.json");
    const { recipes } = await res.json();
    const items = await Promise.all(recipes.map(async function (file) {
      const r = await fetch("recipies/" + file);
      return { ...(await r.json()), file: file };
    }));
    recipeList.innerHTML = items.map(function (r) {
      return '<li class="project-item active" data-filter-item data-category="' + (r.tags || []).join(",") + '" data-recipe="recipies/' + r.file + '">'
        + '<a href="#">'
        + '<figure class="project-img">'
        + '<img src="' + r.image + '" style="height: 30vh;" alt="' + r.title + '" loading="lazy">'
        + '</figure>'
        + '<h3 class="project-title">' + r.title + '</h3>'
        + '<p class="project-category">' + (r.tags || []).join(", ") + '</p>'
        + '</a>'
        + '</li>';
    }).join("");
    filterFunc("all");
  } catch (err) {
    console.error("Error loading recipes:", err);
  }
}

loadRecipes();

recipeList.addEventListener("click", async function (e) {
  const item = e.target.closest("[data-recipe]");
  if (!item) return;
  e.preventDefault();
  const recipeFile = item.dataset.recipe;
  try {
    const response = await fetch(recipeFile);
    const recipe = await response.json();
    recipeImg.src = recipe.image;
    recipeImg.alt = recipe.title;
    recipeTitle.textContent = recipe.title;
    recipeLink.href = recipe.link;
    recipeLink.style.display = recipe.link ? "inline-block" : "none";
    recipeServings.textContent = recipe.servings;
    recipeServings.style.display = recipe.servings ? "block" : "none";
    recipeIngredients.innerHTML = recipe.ingredients.map(function (ing) { return "<li>" + ing + "</li>"; }).join("");
    recipeProcedure.innerHTML = recipe.procedure.map(function (step) { return "<li>" + step + "</li>"; }).join("");
    recipeModalFunc();
  } catch (err) {
    console.error("Error loading recipe:", err);
  }
});

recipeModalCloseBtn.addEventListener("click", recipeModalFunc);
recipeOverlay.addEventListener("click", recipeModalFunc);