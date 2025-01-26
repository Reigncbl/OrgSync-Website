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
                data.data.forEach(event => {
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

    // Render `home_event` events
    const renderEvents = (events) => {
        const eventListContainer = document.getElementById('user-event-list');
        if (events.length > 0) {
            const eventCards = events.map((event) => {
                const eventDate = event.date ? new Date(event.date).toDateString() : 'Unknown Date';
                const startTime = event.date_started || 'Unknown Start Time';
                const endTime = event.date_ended || 'Unknown End Time';

                return `
                    <div class="flex justify-center items-center space-x-8 px-12 py-2 w-full">
                        <div>
                            <h1 class="text-3xl font-bold text-[#900000]">${eventDate.split(' ')[1] || 'N/A'}</h1>
                            <hr class="border-t-2 border-[#800000CC] my-1 w-12" />
                            <h1 class="text-6xl font-extrabold text-[#900000]">${eventDate.split(' ')[2] || '00'}</h1>
                        </div>
                        <img src="data:image/png;base64,${event.banner || ''}" alt="Event Image" class="w-48 h-32 bg-[#BC0C0CC9] rounded-lg drop-shadow-md shadow-md" />
                        <div class="flex-1 flex flex-col justify-between items-start space-y-2 h-full">
                            <div>
                                <h1 class="text-3xl font-bold">${event.event_title || 'Untitled Event'}</h1>
                                <h3 class="text-sm">${event.location || 'Unknown Location'} | Time: ${startTime} - ${endTime}</h3>
                                <h3 class="text-sm">Date: ${eventDate}</h3>
                                <p class="text-sm">Organized by: ${event.org_name || 'Unknown Organization'}</p>
                            </div>
                        </div>
                    </div>
                    `;
            }).join('');

            eventListContainer.innerHTML = eventCards;
        } else {
            eventListContainer.innerHTML = '<p>No events found.</p>';
        }
    };

    // Fetch and render `home_event` events
    fetch('/src/Server/api/read_events.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched event data:', data);
            if (data.status === 'success') {
                renderEvents(data.data || []);
            } else {
                console.log('No events found or error in fetching `home_event`.');
            }
        })
        .catch(error => {
            console.error('Error fetching `home_event` data:', error);
        });
});

function generateCalendar(month, year) {
    const monthYearElement = document.getElementById("month-year");
    const calendarDaysElement = document.getElementById("calendar-days");
    calendarDaysElement.innerHTML = '';

    // Set the month and year
    monthYearElement.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

    // Get the first day of the month and the number of days in the month
    const firstDay = new Date(year, month).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    // Fill in the days of the month
    for (let i = 0; i < firstDay; i++) {
        calendarDaysElement.innerHTML += `<div class="text-gray-400"></div>`; // Empty cells before the first day
    }

    for (let day = 1; day <= numDays; day++) {
        calendarDaysElement.innerHTML += `<div class="p-1 hover:bg-[#800000] hover:text-white rounded-full">${day}</div>`;
    }
}

// Set the current month and year
const currentDate = new Date();
generateCalendar(currentDate.getMonth(), currentDate.getFullYear());

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