// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2604-JAMES";
const API = BASE + COHORT;

// === State ===
let players = [];
let selectedPlayer;
let teams = [];

/**Update state with all players from the API
 */
async function getPlayers() {
  try {
    const response = await fetch(API + "/players");
    console.debug(response);
    const result = await response.json();
    console.debug(result);
    players = result.data;
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
    selectedPlayer = result.data;
    render();
  } catch (error) {
    console.error(error);
  }
}

/** Update state with teams from API */
async function getTeams() {
  try {
    const response = await fetch(API + "/teams");
    const result = await response.json();
    teams = result.data;
    render();
  } catch (error) {
    console.error(error);
  }
}

/** I need a function to invite a new player using the API */
async function inviteNewPlayer(player) {
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
    <a href="#selected">${player.imageUrl}${player.name}</a>
  `;
  $li.addEventListener("click", () => getPlayer(player.id));

  return $li;
}

/**I need a list of player names */
function PlayerList(players) {
  const $ul = document.createElement("ul");
  $ul.classList.add("players");
  console.log(players);
  const $players = players.map(PlayerListItem);
  $ul.replaceChildren(...$players);

  return $ul;
}

/** I need a function to show selected player information */
function SelectedPlayer() {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a player to learn more.";

    return $p;
  }
  /** I need to add a delete button to SelectedPlayer to show up in Puppy Details */
  const $player = document.createElement("section");
  $player.innerHTML = `
    <img alt="${player.name}" src="${players.imageUrl[0].href}"/>
    <p>Name${selectedPlayer.name}</p>
    <p>ID${selectedPlayer.id}</p>
    <p>Breed${selectedPlayer.breed}</p>
    <p>Team${selectedPlayer.teamID}</p>
    <GuestList></GuestList>
    <button id="deletebutton">Delete player</button>
    `;
  $player.querySelector("GuestList").replaceWith(GuestList());

  const $delete = $player.querySelector("button");
  $delete.addEventListener("click", () => deletePlayer(selectedPlayer.id));

  return $player;
}

/** I need a list of guests for the SelectedEvent */
function GuestList() {
  const $ul = document.createElement("ul");
  const guestsAtParty = guests.filter((guest) =>
    teams.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedPlayer.id,
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

/** I need a form element to add a new player with a button*/
function NewPlayerForm() {
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
  <button id="addbutton">Add player</button>
  `;
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData($form);
    const date = new Date(data.get("date")).toISOString();
    inviteNewPlayer({
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
  //I need similar HTML elements as the gala guided practice, changing h1 to event Planner, 1st h2 to Upcoming players, ArtistList to eventList, 2nd h2 to event Details, ArtistDetails to eventDetails
  $app.innerHTML = `
    <h1>Puppy Bowl 2026</h1>
    <main>
      <section>
        <h2>Player Roster</h2>
        <PlayerList></PlayerList>
        <h3>Invite a puppy!</h3>
        <NewPlayerForm></NewPlayerForm>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
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
  await getTeams();
  render();
}

init();
