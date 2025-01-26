document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the user data from sessionStorage (if available)
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const studentId = userData ? userData.student_id : null;
    
    // If no user data is found in sessionStorage, redirect to login page
    if (!userData) {
        console.warn('No user data found in sessionStorage. Redirecting to login page.');
        window.location.href = '/login.html'; // Redirect to login page
        return;
    }
    
    // If user data exists, proceed with setting user information on the page
    if (userData && userData.firstname) {
        // Set the first name in the HTML
        document.getElementById('username').textContent = userData.firstname;

        // Populate the profile section
        if (userData.firstname && userData.email) {
            // Set user profile details
            document.getElementById('dashboard-username').textContent = userData.firstname;
            document.getElementById('dashboard-email').textContent = userData.email;

        } else {
            console.warn('User data incomplete in sessionStorage');
        }
    } else {
        console.warn('User data not found in sessionStorage');
    }

    // Fetch and render `user_top_3` events
fetch(`/src/Server/api/read_calendar.php?student_id=${studentId}`)
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    if (data.data && data.data.length > 0) {
        const userDiv = document.getElementById('user_top_3');

        // Sort events by a specific criterion (e.g., date_started, or any priority field)
        const sortedEvents = data.data.sort((a, b) => new Date(a.date_started) - new Date(b.date_started));

        // Take the top 3 events
        const top3Events = sortedEvents.slice(0, 3);

        // Clear any existing content in `user_top_3` before appending new events
        userDiv.innerHTML = '';

        top3Events.forEach(event => {
            const userCard = document.createElement('div');
            userCard.classList.add('bg-gradient-to-t', 'from-[#E73030]', 'to-[#F2BDBD]', 'shadow', 'rounded-lg', 'relative', 'p-2', 'h-32');

            userCard.innerHTML = `
                <h1 class="text-xl font-bold text-black overflow-hidden h-fit">${event.event_title}</h1>
                <div class="flex space-x-2">
                    <i class="fa-solid fa-circle-user text-white text-2xl"></i>
                    <h1 class="text-xl text-black font-medium">${event.org_name}</h1>
                </div>
            `;
            userDiv.appendChild(userCard);
        });
    } else {
        console.error('No events or data found for `user_top_3`.');
    }
})
.catch(error => {
    console.error('Error fetching `user_top_3` data:', error);
});


    // Fetch and Render Events
// Fetch and Render Events
fetch('/src/Server/api/read_event.php')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('user-event-list');
        if (data.data?.length) {
            // Parse dates and sort events by date_started ascending
            const sortedEvents = data.data.sort((a, b) => new Date(a.date_started) - new Date(b.date_started));

            // Take the top 5 events
            const top5Events = sortedEvents.slice(0, 5);

            // Render only the top 5 sorted events
            container.innerHTML = top5Events.map(event => `
                <div class="event-card flex items-start justify-start space-x-6 mb-8" data-event-id="${event.eventid}">
                    <div class="h-[150px] relative flex">
                        <h1 class="font-medium text-[#800000] text-2xl">${event.date_started}</h1>
                    </div>
                    
                    <div class="flex flex-col items-center justify-center bg-gradient-to-t from-[#E73030] to-[#F2BDBD] rounded-lg h-36 w-96 shadow-2xl">
                        ${event.banner ? `<img src="data:image/png;base64,${event.banner}" class="w-full h-full object-cover rounded-lg">` : ''}
                    </div>

                    <div class="flex flex-col space-y-2 w-full">
                        <h1 class="font-bold text-2xl">${event.event_title}</h1>
                        <p class="text-lg">${event.event_des}</p>
                        <p class="text-lg">Organized by: ${event.org_name}</p>
                    </div>
                
                </div>
                <div class="my-6 text-center">
                    <hr class="border-[#800000] border-t-2">
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>No events available.</p>';
        }
    })
    .catch(error => console.error('Error loading events:', error));
});



fetch('/src/Server/api/read_calendar.php')
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    if (data.data && data.data.length > 0) {
      const eventListContainer = document.getElementById('side-event');
      eventListContainer.innerHTML = ''; 

      const topTwoEvents = data.data.slice(0, 2);

      const eventCards = topTwoEvents.map(event => {
        return `
            <div class="w-full h-fit p-4 bg-[#D9D9D9] rounded-lg shadow-lg flex flex-col space-y-2">
                <div>
                    <h1 class="text-xl font-semibold">${event.event_title}</h1>
                </div>
                <div class="event-box">
                    <i class="fa-solid fa-calendar-days"></i>
                    <h3>${event.date}</h3>
                </div>
                <div class="flex space-x-2">
                    <div class="event-box w-full">
                        <i class="fa-regular fa-clock"></i>
                        <h1>${event.date_started}</h1>
                    </div>
                    <div class="event-box w-full">
                        <i class="fa-regular fa-clock"></i>
                        <h1>${event.date_ended}</h1>
                    </div>
                </div>
                <div class="event-box">
                    <i class="fa-solid fa-location-dot"></i>
                    <h3>${event.location}</h3>
                </div>
            </div>
        `;
      }).join('');

      eventListContainer.innerHTML = eventCards;
    }
  })
  .catch(error => {
    console.error('Error fetching organization data:', error);
  });