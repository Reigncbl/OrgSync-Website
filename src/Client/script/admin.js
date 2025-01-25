// Log before fetching data
console.log('Fetching event data...');

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

fetch('/src/Server/api/read_event.php')
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    if (data.data && data.data.length > 0) {
      const eventListContainer = document.getElementById('admin-event');
      eventListContainer.innerHTML = ''; 
        
      const eventCards = data.data.map(event => {
        return `
            <div class="bg-white p-4 shadow rounded-lg flex items-center">
                <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <span class="font-bold text-lg">${event.date}</span>
                </div>
                <div class="ml-4">
                    <h3 class="font-bold text-lg">${event.event_title}</h3>
                    <p class="text-sm text-gray-600">${event.location} | ${event.date_started} – ${event.date_ended}</p>
                    <p class="text-sm text-gray-600">Organized by: Org Name</p>
                </div>
                <div class="ml-auto">
                    <button class="px-4 py-2 bg-[#E73030] text-white rounded-lg hover:bg-red-700 transition">
                        View Details
                    </button>
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

  document.addEventListener('DOMContentLoaded', () => {
    const databaseLink = document.getElementById('database-link');
    const subLinks = document.getElementById('sub-links');

    databaseLink.addEventListener('click', () => {
        subLinks.classList.toggle('hidden');
    });
});
