// Fetch events data from the server
fetch('/src/Server/api/read_events.php')
  .then(response => response.json())
  .then(data => {
    console.log(data);

    if (data.data && data.data.length > 0) {
      const tableBody = document.getElementById('event-table-body');
      tableBody.innerHTML = '';

      const rows = data.data.map((event, index) => {
        return `
          <tr>
            <td class="border border-gray-300 px-4 py-2 text-center">${index + 1}</td>
            <td class="border border-gray-300 px-4 py-2">${event.event_title}</td>
            <td class="border border-gray-300 px-4 py-2">${event.event_description}</td>
            <td class="border border-gray-300 px-4 py-2">${event.date}</td>
            <td class="border border-gray-300 px-4 py-2">${event.time}</td>
            <td class="border border-gray-300 px-4 py-2">${event.location}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              <img src="/src/Client/img/${event.banner}" alt="Banner" class="w-16 h-16 rounded-md object-cover">
            </td>
            <td class="border border-gray-300 px-4 py-2">${event.status}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              <button class="bg-blue-500 text-white px-4 py-2 rounded" data-event-id="${event.event_id}">Edit</button>
              <button class="bg-red-500 text-white px-4 py-2 rounded" data-event-id="${event.event_id}">Delete</button>
            </td>
          </tr>
        `;
      }).join('');

      tableBody.innerHTML = rows; 

      // Add event listeners to the Edit and Delete buttons
      document.querySelectorAll('button[data-event-id]').forEach(button => {
        button.addEventListener('click', function () {
          const eventId = this.getAttribute('data-event-id');
          const action = this.textContent.trim();

          if (action === 'Edit') {
            // Handle Edit action
            console.log(`Editing event with ID: ${eventId}`);
          } else if (action === 'Delete') {
            // Handle Delete action
            console.log(`Deleting event with ID: ${eventId}`);
          }
        });
      });
    }
  })
  .catch(error => {
    console.error('Error fetching events data:', error);
  });

const newEventBtn = document.getElementById('newEventBtn');
const eventFormPopup = document.getElementById('eventFormPopup');
const closePopupBtn = document.getElementById('closePopupBtn');

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