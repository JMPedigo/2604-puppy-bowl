// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2604-JAMES";
const API = BASE + COHORT;

// === State ===
let players = [];
let selectedPlayer;
let data = {};

/**Update state with all players from the API
 */
async function getPlayers() {
  try {
    const response = await fetch(API + "/players");
    const result = await response.json();
    console.debug(result);
    players = result.data.players;
    render();
  } catch (error) {
    console.error(error);
  }
}

/**Update state with single player from API
 */
async function getPlayer(id) {
  try {
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    console.debug(result);
    selectedPlayer = result.data.players;
    render();
  } catch (error) {
    console.error(error);
  }
}

/** I need a function to create a player using the API */
async function createNewPlayer(player) {
  try {
    await fetch(API + "/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    await getPlayers();
  } catch (error) {
    console.error(error);
  }
}

/** I need a function to delete a player from the list */
async function deletePlayer(id) {
  try {
    await fetch(API + "/players/" + id, {
      method: "DELETE",
    });
    selectedPlayer = undefined;
    await getPlayers();
  } catch (error) {
    console.error(error);
  }
}

// === Components ===

/**I need a single list item containing details about the player when clicked */
function PlayerListItem(player) {
  const $li = document.createElement("li");

  if (player.id === selectedPlayer?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${player.name}</a>
  `;
  $li.addEventListener("click", () => getPlayer(player.id));

  return $li;
}

/**I need a list of player names */
function PlayerList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("players");

  const $players = players.map(PlayerListItem);
  $ul.replaceChildren(...$players);

  return $ul;
}

/** I need a function to show selected event information */
function SelectedPlayer() {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a player to learn more.";

    return $p;
  }
  /** I need to add a delete button to SelectedParty to show up in Party Details */
  const $player = document.createElement("section");
  $player.innerHTML = `
    <h3>${selectedPlayer.name}</h3>
    <p>ID ${selectedPlayer.id}</p>
    <p>Breed ${selectedPlayer.breed}</p>
    <p>Team ${selectedPlayer.teamId}
    <p>Status ${selectedParty.status}</p>
    <button id="gobackbutton">Return to Player Roster</button>
    <button id="deletebutton">Remove from Roster</button>
    `;

  const $delete = $player.querySelector("button");
  $delete.addEventListener("click", () => deletePlayer(selectedPlayer.id));

  return $player;
}

/** I need a list of guests for the SelectedEvent */
/**function GuestList() {
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
}*/

/** I need a form element to add a new party with a button*/
function NewPlayerForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
  <label>
    Name
    <input name="name" required />
  </label>
  <label>
    Breed
    <input name="breed" required />
  </label>
  <button id="addbutton">Add player to roster</button>
  `;
  $form.addEventListener("submit", (player) => {
    player.preventDefault();
    const data = new FormData($form);
    /**const date = new Date(data.get("date")).toISOString();*/
    createNewPlayer({
      name: data.get("name"),
      breed: data.get("breed"),
    });
  });
  return $form;
}
// === Render ===

function render() {
  const $app = document.querySelector("#app");
  //I need similar HTML elements as the gala guided practice, changing h1 to event Planner, 1st h2 to Upcoming Parties, ArtistList to eventList, 2nd h2 to event Details, ArtistDetails to eventDetails
  $app.innerHTML = `
    <h1>Puppy Bowl 2026</h1>
    <main>
      <section>
        <h2>Player Roster</h2>
        <PlayerList></PlayerList>
        <h3>Invite a new player!</h3>
        <NewPlayerForm></NewPlayerForm>
      </section>
      <section id="selected">
        <h2>Player Details</h2>
        <PlayerDetails></PlayerDetails>
      </section>
    </main>
  `;
  $app.querySelector("PlayerList").replaceWith(PlayerList());
  $app.querySelector("NewPlayerForm").replaceWith(NewPlayerForm());
  $app.querySelector("PlayerDetails").replaceWith(SelectedPlayer());
}

async function init() {
  await getPlayers();
  render();
}

init();
