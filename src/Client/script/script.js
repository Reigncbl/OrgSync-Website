// Fetch organization data from the server
fetch('/src/Server/api/read_org.php')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data && Array.isArray(data.data) && data.data.length > 0) {
      const orgListContainer = document.getElementById('organization-list');
      orgListContainer.innerHTML = ''; // Clear existing content

      const orgCards = data.data.map(org => {
        return `
          <div class="w-64 p-4 h-full bg-white rounded-3xl flex flex-col justify-between items-center space-y-4 shadow-md">
            <div class="flex flex-col space-y-4 w-full">
              <img src="/src/Client/img/${org.org_logo || 'default_logo.png'}" alt="${org.org_name}" 
                  class="w-full h-48 rounded-2xl bg-gray-200 object-cover">
              <h3 class="text-2xl font-semibold text-center">${org.org_name || 'Untitled Organization'}</h3>
            </div>
            <button class="w-full p-4 bg-[#F0C9C9] rounded-xl hover:bg-[#ce5a5a] font-semibold" data-org-id="${org.org_id}">Learn More</button>
          </div>
        `;
      }).join('');

      orgListContainer.innerHTML = orgCards;

      document.querySelectorAll('button[data-org-id]').forEach(button => {
        button.addEventListener('click', function () {
          const orgId = this.getAttribute('data-org-id');
          const orgDetails = data.data.find(org => org.org_id == orgId);

          document.getElementById('organization-list').classList.add('hidden');
          const orgDetailContent = document.getElementById('orgDetailContent');
          orgDetailContent.innerHTML = `
            <div class="rounded-2xl shadow-md h-96 flex items-start bg-cover bg-center" 
                 style="background-image: url('/src/Client/img/${orgDetails.org_logo || 'default_logo.png'}'); background-color: rgba(255, 255, 255, 0.1);">
                <div class="flex flex-col space-y-8 p-8 h-full justify-center w-full">
                    <div class="flex flex-col space-y-4">
                        <h1 class="text-5xl font-bold text-black">${orgDetails.org_name || 'Untitled Organization'}</h1>
                        <div class="flex justify-between items-center space-x-4">
                            <button class="button bg-gradient-to-t from-[#F0C9C9] to-[#D9D9D9] text-black font-semibold text-lg p-5 px-7">Follow</button>
                            <div class="flex space-x-6 items-center justify-center">
                                <a href="${orgDetails.facebook || '#'}"><i class="fa-brands fa-facebook text-4xl text-white"></i></a>
                                <a href="${orgDetails.instagram || '#'}"><i class="fa-brands fa-instagram text-4xl text-white"></i></a>
                                <a href="${orgDetails.linkedin || '#'}"><i class="fa-brands fa-linkedin text-4xl text-white"></i></a>
                            </div>
                        </div>
                        <p class="text-md font-medium bg-[#FBF2F2] rounded-2xl p-6">${orgDetails.org_desc || 'No description available.'}</p>
                    </div>
                </div>
            </div>
          `;
          document.getElementById('organization-detail').classList.remove('hidden');
        });
      });

      document.getElementById('backBtn').addEventListener('click', function () {
        document.getElementById('organization-detail').classList.add('hidden');
        document.getElementById('organization-list').classList.remove('hidden');
      });
    } else {
      console.log('No organizations found or error in fetching.');
    }
  })
  .catch(error => {
    console.error('Error fetching organization data:', error);
  });

// Function to render events
function renderEvents(events) {
  const eventListContainer = document.getElementById('event-list');
  if (!eventListContainer) {
    console.error('Missing event list container');
    return;
  }

  eventListContainer.innerHTML = ''; // Clear existing content

  if (events.length > 0) {
    const eventCards = events.map((event) => {
      const eventDate = event.date ? new Date(event.date).toDateString() : 'Unknown Date';
      const startTime = event.date_started || 'Unknown Start Time';
      const endTime = event.date_ended || 'Unknown End Time';

      return `
        <div class="flex justify-start items-start space-x-8 px-12 py-8 w-full border-b-2 border-[#800000CC]">
          <div>
            <h1 class="text-3xl font-bold text-[#900000]">${eventDate.split(' ')[1] || 'N/A'}</h1>
            <hr class="border-t-2 border-[#800000CC] my-1 w-12" />
            <h1 class="text-6xl font-extrabold text-[#900000]">${eventDate.split(' ')[2] || '00'}</h1>
          </div>
          <img src="data:image/png;base64,${event.banner || ''}" alt="Event Image" class="w-64 h-48 bg-[#BC0C0CC9] rounded-lg drop-shadow-md shadow-md" />
          <div class="flex-1 flex flex-col justify-between items-start space-y-2 h-full">
            <div>
              <h1 class="text-3xl font-bold">${event.event_title || 'Untitled Event'}</h1>
              <h3 class="text-sm">${event.location || 'Unknown Location'}</h3>
              <h3 class="text-sm">Date: ${eventDate}</h3>
              <h3 class="text-sm">Time: ${startTime} - ${endTime}</h3>
              <p class="text-sm">${event.event_des || 'No description available.'}</p>
              <p class="text-sm">Organized by: ${event.org_name || 'Unknown Organization'}</p>
            </div>
            <div class="w-full flex flex-col items-end">
              <hr class="w-full border-t-2 border-[#800000CC] my-4" />
              <button class="text-[#800000] pr-4">
                View Event Details <i class="pl-2 fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>`;
    }).join('');

    eventListContainer.innerHTML = eventCards;
  } else {
    eventListContainer.innerHTML = '<p>No events found.</p>';
  }
}

// Fetch and render events
fetch('/src/Server/api/home_event.php')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log('Fetched event data:', data);
    if (data.status === 'success') {
      renderEvents(data.data || []);
    } else {
      console.log('No events found or error in fetching.');
    }
  })
  .catch((error) => console.error('Error fetching events:', error));
