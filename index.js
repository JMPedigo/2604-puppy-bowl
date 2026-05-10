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
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
        <h1>Puppy Bowl 2026</h1>
        <main>
            <section>
                <h2>Player Roster</h2>
                <PuppyList></PuppyList>
            </section>
            <section id="selected">
                <h2>Player Details</h2>
                <SelectedPuppy></SelectedPuppy>
            </section>
        </main>
    `;

  $app.querySelector("PuppyList").replaceWith(PuppyList());
  //$app.querySelector("SelectedPuppy").replaceWith(Selected)
}

async function init() {
  render();
}

init();
