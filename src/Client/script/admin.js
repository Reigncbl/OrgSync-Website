document.addEventListener('DOMContentLoaded', () => {
    // Redirect if no user data found in sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        console.warn('No user data found in sessionStorage. Redirecting to login page.');
        window.location.href = '/login.html';
        return;
    }


    // Extract `org_id` from userData
    const userOrgId = userData.org_id;
    if (!userOrgId) {
        console.error('org_id not found in user data:', userData);
        return;
    }

    const eventCountElement = document.getElementById('total-event-count');
    if (!eventCountElement) {
        console.error('Event count element not found in the HTML.');
        return;
    }

    // Fetch and update event count
    fetch('http://localhost:3000/src/Server/api/read_event.php')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data?.data) {
                const filteredEvents = data.data.filter(event => event.org_id === userOrgId);
                eventCountElement.textContent = filteredEvents.length; // Update the event count in HTML
            } else {
                console.warn('No events data found in the response.');
                eventCountElement.textContent = '0'; // Default to 0
            }
        })
        .catch(error => {
            console.error('Error fetching event data:', error);
            eventCountElement.textContent = '0'; // Default to 0 on error
        });

    // Function to update the user count in the HTML
    function updateUserCount(count) {
        const userCountElement = document.querySelector('.bg-gradient-to-t .text-4xl.font-bold');
        if (userCountElement) {
            userCountElement.textContent = count.toString().padStart(2, '0'); // Format as two digits
        } else {
            console.error('User count element not found in the HTML');
        }
    }

    // Fetch followers and count them
    fetch('http://localhost:3000/src/Server/api/read_followers.php', {
        method: 'GET',
        credentials: 'include', // Ensures cookies/session info are sent
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse as JSON
        })
        .then((data) => {
            if (data.status === 'success') {
                // Filter followers by `org_id` and count them
                const filteredFollowers = (data.data || []).filter(follower => follower.org_id === userOrgId);
                const userCount = filteredFollowers.length;
                console.log('Total number of users:', userCount);

                // Update the HTML with the user count
                updateUserCount(userCount);
            } else {
                console.warn('No followers data found:', data);
                updateUserCount(0); // Display 0 if no data found
            }
        })
        .catch((error) => {
            console.error('Error fetching followers:', error);
            updateUserCount(0); // Handle error gracefully
        });


    // Function to render events
    function renderEvents(events) {
        const eventListContainer = document.getElementById('admin-event');
        if (!eventListContainer) {
            console.error('Missing event list container');
            return;
        }

        // Filter events by org_id
        const filteredEvents = events.filter(event => event.org_id === userOrgId);
        console.log('Filtered events:', filteredEvents);

        if (filteredEvents.length > 0) {
            const eventCards = filteredEvents.map(event => `
                <div class="bg-white p-4 shadow rounded-lg flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-16 h-16 flex items-center justify-center">
                            <span class="font-bold text-lg">${event.date || 'N/A'}</span>
                        </div>
                        <div class="ml-4">
                            <h3 class="font-bold text-lg">${event.event_title || 'Untitled Event'}</h3>
                            <p class="text-sm text-gray-600">${event.location || 'No Location'} | ${event.date_started || 'N/A'} – ${event.date_ended || 'N/A'}</p>
                            <p class="text-sm text-gray-600">Organized by: ${event.org_name || 'Unknown Organization'}</p>
                        </div>
                    </div>
                    <div class="ml-auto">
                        <button class="px-4 py-2 bg-[#E73030] text-white rounded-lg hover:bg-red-700 transition">
                            View Details
                        </button>
                    </div>
                </div>
            `).join('');
            eventListContainer.innerHTML = eventCards;
        } else {
            console.warn('No events found for org_id:', userOrgId);
            eventListContainer.innerHTML = '<p>No events found.</p>';
        }
    }

    // Fetch and render events
    fetch('/src/Server/api/read_event.php')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Use text first to debug issues
        })
        .then((responseText) => {
            try {
                const data = JSON.parse(responseText); // Parse as JSON
                console.log('Fetched event data:', data);
                renderEvents(data.data || []);
            } catch (err) {
                console.error('Error parsing JSON:', err, responseText);
            }
        })
        .catch((error) => console.error('Error fetching events:', error));

    // Toggle sub-links visibility
    const databaseLink = document.getElementById('database-link');
    const subLinks = document.getElementById('sub-links');
    if (databaseLink && subLinks) {
        databaseLink.addEventListener('click', () => {
            subLinks.classList.toggle('hidden');
        });
    }
});