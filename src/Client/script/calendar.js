document.addEventListener('DOMContentLoaded', () => {
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
                    eventElement.innerHTML += `<div class="bg-red-500 text-white font-semibold p-2 rounded-lg shadow-md mb-1" style="background-color: #f87171 !important;">${event.event_title}</div>`;
                }
            }
        });
    };

    // Fetch event data from the API
    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/src/Server/api/read_event.php');
            const data = await response.json();

            console.log('Fetched data:', data); // Log API response

            // Check if the response has a `data` property and it's an array
            if (data && data.status === "success" && Array.isArray(data.data)) {
                events = data.data; // Assign the `data` array to `events`
                console.log('Events loaded:', events); // Log events
                renderCalendar(currentMonth, currentYear); // Render the calendar with events
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
