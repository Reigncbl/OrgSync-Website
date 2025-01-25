document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(sessionStorage.getItem('userData')); // Retrieve user data from sessionStorage
    if (!userData) {
        window.location.href = '/login.html'; // Redirect if no user data found
    }

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    const calendarContainer = document.getElementById('calendar-dates');
    const monthTitle = document.getElementById('month-title');
    const yearTitle = document.getElementById('year-title');

    let events = []; // Array to hold events fetched from the API

    // Function to render the calendar for a given month and year
    const renderCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Clear the calendar container
        calendarContainer.innerHTML = '';

        // Set the month and year titles
        monthTitle.textContent = new Date(year, month).toLocaleString('default', { month: 'long' });
        yearTitle.textContent = year;

        // Add empty divs for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarContainer.innerHTML += '<div class="py-2"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            calendarContainer.innerHTML += `
                <div class="py-2 relative border h-32">
                    <span class="absolute top-1 left-1 text-xs font-bold">${day}</span>
                    <div id="event-${day}" class="mt-6 text-xs rounded-lg">
                        <!-- Event content will go here -->
                    </div>
                </div>`;
        }

        // Display events on the calendar
        events.forEach(event => {
            const eventDate = new Date(event.date);
            if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
                const eventElement = document.getElementById(`event-${eventDate.getDate()}`);
                if (eventElement) {
                    eventElement.innerHTML += `<div class="text-white font-semibold p-2 rounded-lg shadow-md mb-1" style="background-color: #f87171 !important;">${event.event_title}</div>`;
                }
            }
        });
    };

    // Fetch event data from the API
    const fetchEvents = async () => {
        try {
            const response = await fetch('/src/Server/api/read_calendar.php');
            const data = await response.json();
    
            console.log('Fetched data:', data); 
    
            if (data && Array.isArray(data.data)) {
                const studentId = userData.student_id; // Get student_id from user data
                events = data.data.filter(event => event.student_id === studentId); // Filter events by student_id
                console.log('Filtered events:', events);
                renderCalendar(currentMonth, currentYear);
            } else {
                console.error('Unexpected API response format:', data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    // Fetch events when the page loads
    fetchEvents();

    // Navigation buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        renderCalendar(currentMonth, currentYear);
    });
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

