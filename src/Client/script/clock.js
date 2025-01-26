// Function to update date and time
function updateDateTime() {
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    const timeIcon = document.getElementById('time-icon');

    if (!dateElement || !timeElement || !timeIcon) {
        console.error('Missing elements for date/time update');
        return;
    }

    const now = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString(undefined, options);

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    timeElement.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    timeIcon.className = `text-2xl fa-solid ${ampm === 'AM' ? 'fa-sun' : 'fa-moon'}`;
    timeIcon.style.color = ampm === 'AM' ? '#FFAE21' : '#2563eb';
}

// Update date and time every second
setInterval(updateDateTime, 1000);
updateDateTime();


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