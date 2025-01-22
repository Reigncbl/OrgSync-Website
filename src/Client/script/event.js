// Log before fetching data
console.log('Fetching event data...');

// Fetch events data from the server
fetch('http://localhost:3000/src/Server/api/read_event.php')
    .then(response => {
        // Log the raw response
        console.log('Raw response:', response);

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Return parsed JSON
        return response.json();
    })
    .then(data => {
        console.log('Parsed Events:', data); // Log the entire API response

        const tableBody = document.getElementById('event-table-body');

        if (typeof data === 'object' && data.data && data.data.length > 0) {
            const eventList = data.data;

            // Loop through each event and create table rows
            eventList.forEach((event, index) => {
                console.log(`Event ${index + 1}:`, event); // Log each event

                // Create a new row
                const row = document.createElement('tr');
                row.classList.add('hover:bg-gray-800', 'transition-colors', 'cursor-pointer');

                // Add event details to the row
                row.innerHTML = `
                    <td class="table-col">${index + 1}</td>
                    <td class="table-col">${event.event_title}</td>
                    <td class="table-col">${event.event_des}</td>
                    <td class="table-col">${event.date}</td>
                    <td class="table-col">${event.date_started} - ${event.date_ended}</td>
                    <td class="table-col">${event.location}</td>
                    <td class="table-col">${event.eventvisibility}</td>
                    <td class="table-col">
                        <button data-event-id="${event.id}" class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 focus:outline-none">Edit</button>
                        <button data-event-id="${event.id}" class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 ml-2 focus:outline-none">Delete</button>
                    </td>
                `;

                // Append the row to the table body
                tableBody.appendChild(row);
            });

            // Add event listeners to the Edit and Delete buttons
            document.querySelectorAll('button[data-event-id]').forEach(button => {
                button.addEventListener('click', function () {
                    const eventId = this.getAttribute('data-event-id');
                    const action = this.textContent.trim();

                    if (action === 'Edit') {
                        console.log(`Editing event with ID: ${eventId}`);
                        // Add your edit logic here
                    } else if (action === 'Delete') {
                        console.log(`Deleting event with ID: ${eventId}`);
                        // Add your delete logic here
                    }
                });
            });
        } else {
            console.log('No events found.');
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4">No events to display.</td></tr>`;
        }
    })
    .catch(error => {
        console.error('Error fetching events:', error);
        const tableBody = document.getElementById('event-table-body');
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Error loading events. Please try again later.</td></tr>`;
    });

// Popup logic for form
const newEventBtn = document.getElementById('newEventBtn');
const eventFormPopup = document.getElementById('eventFormPopup');
const closePopupBtn = document.getElementById('closePopupBtn');

if (newEventBtn && eventFormPopup && closePopupBtn) {
    newEventBtn.addEventListener('click', () => {
        eventFormPopup.classList.remove('hidden');
    });

    closePopupBtn.addEventListener('click', () => {
        eventFormPopup.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === eventFormPopup) {
            eventFormPopup.classList.add('hidden');
        }
    });
}

// File input label update
const bannerInput = document.getElementById('banner');
const fileLabel = document.getElementById('fileLabel');

if (bannerInput && fileLabel) {
    bannerInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        fileLabel.textContent = file ? file.name : 'Upload an image to display as the event banner \n(Max size: 5MB)';
    });
}

// Form submission with validation
function submitForm() {
    const form = document.getElementById('eventForm');
    if (!form) return;

    const formData = new FormData(form);

    const eventTitle = document.getElementById('event_title').value.trim();
    const eventDes = document.getElementById('event_des').value.trim();
    const platform = document.getElementById('platform').value.trim();
    const platformLink = document.getElementById('platform_link').value.trim();
    const location = document.getElementById('location').value.trim();
    const startDate = document.getElementById('date_started').value;
    const endDate = document.getElementById('date_ended').value;

    // Validate required fields
    if (!eventTitle || !eventDes || !platform || !platformLink || !location) {
        alert('Please fill in all required fields.');
        return;
    }

    // Validate platform link
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(platformLink)) {
        alert('Please enter a valid platform link.');
        return;
    }

    // Validate start and end dates
    if (startDate >= endDate) {
        alert('Start date must be before end date.');
        return;
    }

    console.log('Submitting form...');
    fetch('http://localhost:3000/src/Server/api/event_add.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Server Response:', data);
            alert(data.message || 'Event added successfully.');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('Error during form submission.');
        });
}

// Attach submitForm to the form's submit event
const eventForm = document.getElementById('eventForm');
if (eventForm) {
    eventForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission
        submitForm();
    });
}