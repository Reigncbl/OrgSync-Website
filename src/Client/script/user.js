document.addEventListener('DOMContentLoaded', () => {
    // User Authentication Check
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        window.location.href = '/login.html';
        return;
    }

    // Populate User Info
    document.getElementById('dashboard-username').textContent = `${userData.firstname} ${userData.lastname}`;
    document.getElementById('dashboard-email').textContent = userData.email;
    document.getElementById('profile-initial').textContent = userData.firstname[0];

    // Real-time Clock
    function updateDateTime() {
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');
        const now = new Date();
        
        dateElement.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}`;
        
        timeElement.innerHTML = `<i class="fa-solid fa-clock"></i> ${now.toLocaleTimeString()}`;
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Fetch and Render Events with Event Delegation
    fetch('/src/Server/api/read_event.php')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('upcomingEvents');
        if(data.data?.length) {
            container.innerHTML = data.data.map(event => `
                <div class="event-card flex items-start justify-start space-x-6 mb-8" data-event-id="${event.eventid}">
                    <div class="h-[150px] relative flex">
                        <h1 class="font-medium text-[#800000] text-2xl">${event.date}</h1>
                    </div>
                    
                    <div class="flex flex-col items-center justify-center bg-gradient-to-t from-[#E73030] to-[#F2BDBD] rounded-lg h-36 w-96 shadow-2xl">
                        ${event.banner ? `<img src="data:image/png;base64,${event.banner}" class="w-full h-full object-cover rounded-lg">` : ''}
                    </div>

                    <div class="flex flex-col space-y-2 w-full">
                        <h1 class="font-bold text-2xl">${event.event_title}</h1>
                        <p class="text-lg">${event.event_des}</p>
                        <p class="text-lg">Organized by: ${event.org_name}</p>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <button class="join-event-btn w-1/2 px-4 py-2 font-medium text-white bg-gradient-to-t from-[#1F1616] to-[#EF0F0F] rounded-3xl hover:bg-white hover:text-black">
                            Join Event
                        </button>
                    </div>
                </div>
                <div class="my-6 text-center">
                    <hr class="border-[#800000] border-t-2">
                </div>
            `).join('');
        }
    })
    .catch(error => console.error('Error loading events:', error));

    // Event Delegation for Join Buttons
    document.addEventListener('click', async (e) => {
        if(e.target.closest('.join-event-btn')) {
            const eventCard = e.target.closest('.event-card');
            const eventId = eventCard.dataset.eventId;
            const userData = JSON.parse(sessionStorage.getItem('userData'));

            if (!userData) {
                alert('Please log in to join events.');
                window.location.href = '/login.html';
                return;
            }

            if (!userData.org_id) {
                alert('You need to be part of an organization to join events');
                return;
            }

            try {
                const response = await fetch('/src/Server/api/calendar_add.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        event_id: eventId,
                        student_id: userData.student_id,
                        org_id: userData.org_id,
                        is_attending: true,
                        added_at: new Date().toISOString(),
                        visibility_status: 'public'
                    })
                });

                const result = await response.json();
                
                if(result.success) {
                    e.target.disabled = true;
                    e.target.textContent = 'Joined!';
                    e.target.classList.remove('bg-gradient-to-t', 'from-[#1F1616]', 'to-[#EF0F0F]');
                    e.target.classList.add('bg-green-500', 'hover:bg-green-500');
                    alert('Successfully joined event!');
                } else {
                    throw new Error(result.message || 'Failed to join event');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Failed to join event: ${error.message}`);
            }
        }
    });
});