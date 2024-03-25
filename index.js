const COHORT = "2401-FTB-MT-WEB-PT";
const APIURL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// state
const state = {
  events: [],
};

// query selector elements
const eventList = document.querySelector("#addEvent");
eventList.addEventListener("submit", addEvent);

// sync state with API and rerender
async function getEvents() {
  try {
    const response = await fetch(APIURL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}
function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }
}

const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${event.name}</h2>
      <h3>${event.date}</h3>
      <h3>${event.time}</h3>
      <h3>${event.location}</h3>
      <p>${event.description}</p>
      
    `;
    return li;
  });

  artistList.replaceChildren(...artistCards);

  //   update state with events from API

  async function addEvent(event) {
    event.preventDefault();

    try {
      const response = await fetch(APIURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addEventForm.name.value,
          date: addEventForm.date.value,
          time: addEventForm.time.value,
          location: addEventForm.location.value,
          description: addEventForm.description.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      render();
    } catch (error) {
      console.error(error);
    }
  }



