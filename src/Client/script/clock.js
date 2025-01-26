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
