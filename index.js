// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2604-JAMES";
const API = BASE + COHORT;

// === State ===
let puppies = [];
let selectedPuppy;

// === Components ===

/** I need a function to create a list item that provides player details when clicked */
function PuppyListItem(puppy) {
  const $li = document.createElement("li");

  if (puppy.id === selectedPuppy?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
        <a href="selected">${puppy.name}</a>
    `;

  return $li;
}

/** I need a function to create an unordered list to contain my list items */
function PuppyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("puppies");

  const $puppies = puppies.map(PuppyListItem);
  $ul.replaceChildren(...$puppies);

  return $ul;
}
// === Render ===
