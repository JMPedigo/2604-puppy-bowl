// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2604-JAMES";
const API = BASE + COHORT;

// === State ===
let players = [];
let selectedPlayer;
let teams = [];

/**Update state with all events from the API
 */
async function getParties() {
  try {
    const response = await fetch(API + "/events");
    const result = await response.json();
    parties = result.data;
    render();
  } catch (error) {
    console.error(error);
  }
}

/**Update state with single event from API
 */
async function getParty(id) {
  try {
    const response = await fetch(API + "/events/" + id);
    const result = await response.json();
    selectedParty = result.data;
    render();
  } catch (error) {
    console.error(error);
  }
}

/** Update state with RSVPs from API */
async function getRsvps() {
  try {
    const response = await fetch(API + "/rsvps");
    const result = await response.json();
    rsvps = result.data;
    render();
  } catch (error) {
    console.error(error);
  }
}

/** Update state with guests from API */
async function getGuests() {
  try {
    const response = await fetch(API + "/guests");
    const result = await response.json();
    guests = result.data;
    render();
  } catch (error) {
    console.error(error);
  }
}

/** I need a function to create a party using the API */
async function createNewParty(party) {
  try {
    await fetch(API + "/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(party),
    });
    await getParties();
  } catch (error) {
    console.error(error);
  }
}

/** I need a function to delete a party from the list */
async function deleteParty(id) {
  try {
    await fetch(API + "/events/" + id, {
      method: "DELETE",
    });
    selectedParty = undefined;
    await getParties();
  } catch (error) {
    console.error(error);
  }
}

// === Components ===

/**I need a single list item containing details about the event when clicked */
function PartyListItem(party) {
  const $li = document.createElement("li");

  if (party.id === selectedParty?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${party.name}</a>
  `;
  $li.addEventListener("click", () => getParty(party.id));

  return $li;
}

/**I need a list of event names */
function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("parties");

  const $parties = parties.map(PartyListItem);
  $ul.replaceChildren(...$parties);

  return $ul;
}

/** I need a function to show selected event information */
function SelectedParty() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";

    return $p;
  }
  /** I need to add a delete button to SelectedParty to show up in Party Details */
  const $party = document.createElement("section");
  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>
    <address>${selectedParty.location}</address>
    <p>${selectedParty.description}</p>
    <GuestList></GuestList>
    <button id="deletebutton">Delete party</button>
    `;
  $party.querySelector("GuestList").replaceWith(GuestList());

  const $delete = $party.querySelector("button");
  $delete.addEventListener("click", () => deleteParty(selectedParty.id));

  return $party;
}

/** I need a list of guests for the SelectedEvent */
function GuestList() {
  const $ul = document.createElement("ul");
  const guestsAtParty = guests.filter((guest) =>
    rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id,
    ),
  );

  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement("li");
    $guest.textContent = guest.name;
    return $guest;
  });
  $ul.replaceChildren(...$guests);

  return $ul;
}

/** I need a form element to add a new party with a button*/
function NewPartyForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
  <label>
    Name
    <input name="name" required />
  </label>
  <label>
    Description
    <input name="description" required />
  </label>
  <label>
    Date
    <input name="date" type ="date" required />
  </label>
  <label>
    Location
    <input name="location" required />
  </label>
  <button id="addbutton">Add party</button>
  `;
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData($form);
    const date = new Date(data.get("date")).toISOString();
    createNewParty({
      name: data.get("name"),
      description: data.get("description"),
      date,
      location: data.get("location"),
    });
  });

  return $form;
}
// === Render ===

function render() {
  const $app = document.querySelector("#app");
  //I need similar HTML elements as the gala guided practice, changing h1 to event Planner, 1st h2 to Upcoming Parties, ArtistList to eventList, 2nd h2 to event Details, ArtistDetails to eventDetails
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
        <h3>Add a new party</h3>
        <NewPartyForm></NewPartyForm>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <PartyDetails></PartyDetails>
      </section>
    </main>
  `;
  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("NewPartyForm").replaceWith(NewPartyForm());
  $app.querySelector("PartyDetails").replaceWith(SelectedParty());
}

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();
