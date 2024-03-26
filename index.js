// A user enters the website and finds a list of the names, dates, times,
// locations, and descriptions of all the parties that are happening.
// Next to each party in the list is a delete button. The user clicks the
// delete button for one of the parties. That party is then removed from the list.
// There is also a form that allows the user to enter information about a
// new party that they want to schedule. After filling out the form and submitting it,
// the user observes their party added to the list of parties.

document.addEventListener("DOMContentLoaded", () => {
  const COHORT = "2401-FTB-MT-WEB-PT";
  const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

  // state
  const state = {
    parties: [],
  };

  // query selector elements
  const partyList = document.getElementById("party-list");
  const partyForm = document.getElementById("party-form");

  // sync state with API and rerender
  async function fetchParties() {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      state.parties = json.data;
    } catch (error) {
      console.error(error);
    }
  }
  function renderParties() {
    partyList.innerHTML = "";
    if (state.parties.length === 0) {
      partyList.innerHTML = "<li>No events.</li>";
    } else {
      state.parties.forEach((party) => {
        renderParty(party);
      });
    }
  }

  async function addParty(partyData) {
    try {
        const newDate = new Date(partyData.date)
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...partyData, 
            date: newDate.toISOString()
        }),

        
      });

      if (response.ok) {
        const newParty = await response.json();
        state.parties.push(newParty.data);
        console.log(newParty)
        renderParties();
        partyForm.reset();
      } else {
        console.error("Failed to add party:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding party:", error);
    }
  }

  async function deleteParty(partyId) {
    try {
        console.log(partyId)
      const response = await fetch(`${API_URL}/${partyId}`, {
        method: "DELETE",
      });
    //   console.log(typeof partyId, typeof state.parties[0].id)
      if (response.ok) {
        state.parties = state.parties.filter((party) => party.id !== Number(partyId));
        renderParties();
      } else {
        console.error("Failed to delete party:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting party:", error);
    }
  }

  function renderParty(party) {
    const partyItem = document.createElement("div");
    partyItem.classList.add("party-item");
    partyItem.innerHTML = `
    <h3>${party.name}</h3>
    <li><strong>Date:</strong> ${party.date}</li>
    <li><strong>Location:</strong> ${party.location}</li>
    <li><strong>Description:</strong> ${party.description}</li>
    <button class="delete-btn" data-id="${party.id}">Delete</button>
      
    `;

    partyList.appendChild(partyItem);
  }

  partyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(partyForm);
    const partyData = Object.fromEntries(formData.entries());
    console.log(partyData)
    addParty(partyData);
  });

  partyList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const partyId = e.target.getAttribute("data-id");
      console.log(partyId)
      deleteParty(partyId);
    }
  });

  fetchParties();
});
