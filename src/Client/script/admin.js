function updateDateTime() {
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    const timeIcon = document.getElementById('time-icon');

    const now = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString(undefined, options);

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; 
    hours = hours ? hours : 12;

    timeElement.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Switch between sun and moon based on time
    if (ampm === 'AM') {
        timeIcon.className = 'text-2xl fa-solid fa-sun';
        timeIcon.style.color = '#FFAE21';
    } else {
        timeIcon.className = 'text-2xl fa-solid fa-moon';
        timeIcon.style.color = '#2563eb';
    }
}

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call