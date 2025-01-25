document.addEventListener('DOMContentLoaded', () => {
    // User Data Handling
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) window.location.href = '/login.html';
    
    // Populate User Info
    document.getElementById('dashboard-username').textContent = `${userData.firstname} ${userData.lastname}`;
    document.getElementById('dashboard-email').textContent = userData.email;
    document.getElementById('profile-initial').textContent = userData.firstname[0];
    document.getElementById('profile-initial').textContent += userData.or;

    // Real-time Clock
    function updateDateTime() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('current-date').innerHTML = `
            <i class="fa-solid fa-calendar-days"></i>
            <h1>${new Date().toLocaleDateString(undefined, options)}</h1>
        `;
        document.getElementById('current-time').innerHTML = `
            <i class="fa-solid fa-clock"></i>
            <h1>${new Date().toLocaleTimeString()}</h1>
        `;
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Load Events
    fetch('/src/Server/api/read_event.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('events-container');
            if(data.data?.length) {
                container.innerHTML = data.data.map(event => `
                    <div class="flex items-start space-x-8 bg-[#D9D9D9] rounded-3xl p-6 h-64 w-full">
                        ${event.banner ? `
                        <img src="data:image/png;base64,${event.banner}" 
                            class="w-72 h-full bg-slate-500 rounded-xl object-cover"
                            alt="${event.event_title}">` : 
                        '<div class="w-72 h-full bg-slate-500 rounded-xl"></div>'}
                        
                        <div class="flex flex-col justify-between h-full w-full">
                            <div>
                                <h1 class="text-3xl font-semibold">${event.event_title}</h1>
                                <h3 class="text-[#900000] font-medium mt-2">
                                    <span>${event.date}</span>
                                    <span>${event.date_started} - ${event.date_ended}</span>
                                </h3>
                            </div>
                            <p class="mt-4 text-gray-700">${event.event_des}</p>
                            <div class="flex justify-end">
                                <button class="button-dash text-[#900000] hover:text-white hover:bg-[#900000] transition px-4 py-2 rounded-xl border border-[#900000]">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        });

    // Logout functionality
    document.addEventListener('click', (e) => {
        if(e.target.closest('#logout-btn')) {
            sessionStorage.removeItem('userData');
            fetch('/src/Server/api/logout.php', {
                credentials: 'include'
            }).then(() => window.location.href = '/login.html');
        }
    });
});