document.addEventListener('DOMContentLoaded', () => {

  
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Populate User Info
    console.log('Populating user info...');
    document.getElementById('dashboard-username').textContent = `${userData.firstname} ${userData.lastname}`;
    document.getElementById('dashboard-email').textContent = userData.email;
    document.getElementById('profile-initial').textContent = userData.firstname[0];
    console.log('User info populated successfully');

    // Real-time Clock
    function updateDateTime() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const currentDate = new Date().toLocaleDateString(undefined, options);
        const currentTime = new Date().toLocaleTimeString();

        console.log('Updating date and time:', { currentDate, currentTime });

        document.getElementById('current-date').innerHTML = `
            <i class="fa-solid fa-calendar-days"></i>
            <h1>${currentDate}</h1>
        `;
        document.getElementById('current-time').innerHTML = `
            <i class="fa-solid fa-clock"></i>
            <h1>${currentTime}</h1>
        `;
    }

    console.log('Starting real-time clock...');
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Load Events with Organization Filter
    console.log('Fetching events from server...');
    fetch('/src/Server/api/read_event.php', {
        credentials: 'include'  // Include cookies for session validation
    })
    .then(response => {
        console.log('Fetch response received:', response);

        if (!response.ok) {
            console.error('Fetch failed with status:', response.status);
            throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Event data received:', data);

        const container = document.getElementById('events-container');
        if (!container) {
            console.error('Events container not found in DOM');
            return;
        }

        if (data.data?.length) {
            console.log(`Rendering ${data.data.length} events...`);
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
            console.log('Events rendered successfully');
        } else {
            console.warn('No events found in response');
            container.innerHTML = '<p class="text-center text-gray-600">No events found.</p>';
        }
    })
    .catch(error => {
        console.error('Error loading events:', error);
        const container = document.getElementById('events-container');
        if (container) {
            container.innerHTML = '<p class="text-center text-red-500">Failed to load events. Please try again later.</p>';
        } else {
            console.error('Events container not found in DOM');
        }
    });

    // Logout functionality
    document.addEventListener('click', (e) => {
        if (e.target.closest('#logout-btn')) {
            console.log('Logout button clicked');

            sessionStorage.removeItem('userData');
            console.log('User data removed from sessionStorage');

            fetch('/src/Server/api/logout.php', {
                method: 'POST',
                credentials: 'include'
            })
            .then(response => {
                console.log('Logout response received:', response);
                if (!response.ok) {
                    throw new Error(`Logout failed with status: ${response.status}`);
                }
                window.location.href = '/login.html';
            })
            .catch(error => {
                console.error('Logout failed:', error);
                alert('Logout failed. Please try again.');
            });
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