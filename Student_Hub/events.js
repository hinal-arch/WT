let events = [];
let filteredEvents = [];

let currentPage = 1;
const recordsPerPage = 6;



const eventContainer = document.getElementById("eventContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const pagination = document.getElementById("pagination");
const loading = document.getElementById("loading");
const error = document.getElementById("error");



async function loadEvents() {

    try {

        loading.style.display = "block";

        const response = await fetch("events.json");

        if (!response.ok) {
            throw new Error("Unable to load events.json");
        }

        events = await response.json();

        filteredEvents = [...events];

        loading.style.display = "none";

        renderEvents();

    } catch (err) {

        loading.style.display = "none";

        error.textContent =
            "Error: " + err.message;

    }
}



function applyFilters() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;


    filteredEvents = events.filter(event => {

        const searchMatch =
            event.name
                .toLowerCase()
                .includes(searchText);

        const categoryMatch =
            selectedCategory === "all" ||
            event.category === selectedCategory;

        return searchMatch && categoryMatch;

    });


    sortEvents();

    currentPage = 1;

    renderEvents();
}



function sortEvents() {

    const sortValue = sortSelect.value;


    if (sortValue === "nameAsc") {

        filteredEvents.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    }


    else if (sortValue === "nameDesc") {

        filteredEvents.sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    }


    else if (sortValue === "dateAsc") {

        filteredEvents.sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

    }


    else if (sortValue === "dateDesc") {

        filteredEvents.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

    }
}


function renderEvents() {

    eventContainer.innerHTML = "";


    if (filteredEvents.length === 0) {

        eventContainer.innerHTML =
            "<p>No events found.</p>";

        pagination.innerHTML = "";

        return;
    }


    const start =
        (currentPage - 1) * recordsPerPage;

    const end =
        start + recordsPerPage;

    const currentEvents =
        filteredEvents.slice(start, end);


    currentEvents.map(event => {

        const card =
            document.createElement("div");

        card.className = "event-card";


        card.innerHTML = `
            <h2>${event.name}</h2>

            <p>
                <strong>Category:</strong>
                ${event.category}
            </p>

            <p>
                <strong>Date:</strong>
                ${event.date}
            </p>

            <p>
                <strong>Venue:</strong>
                ${event.venue}
            </p>
        `;


        eventContainer.appendChild(card);

    });


    createPagination();
}



function createPagination() {

    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredEvents.length /
            recordsPerPage
        );


    for (let i = 1; i <= totalPages; i++) {

        const button =
            document.createElement("button");

        button.textContent = i;

        button.className = "page-button";


        if (i === currentPage) {
            button.classList.add("active");
        }


        button.addEventListener("click", () => {

            currentPage = i;

            renderEvents();

        });


        pagination.appendChild(button);

    }
}



searchInput.addEventListener(
    "input",
    applyFilters
);

categoryFilter.addEventListener(
    "change",
    applyFilters
);

sortSelect.addEventListener(
    "change",
    applyFilters
);



loadEvents();