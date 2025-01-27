document.addEventListener('DOMContentLoaded', () => {
    // User Authentication Check
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        window.location.href = '/login.html';
        return;
    }

    // Debug: Display session info
    function createDebugPanel() {
        const debugContainer = document.createElement('div');
        debugContainer.id = 'session-debug';
        Object.assign(debugContainer.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'white',
            padding: '15px',
            border: '2px solid #800000',
            borderRadius: '8px',
            zIndex: '1000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            fontSize: '14px'
        });

        const preStyle = {
            margin: '0',
            fontSize: '12px',
            maxHeight: '300px',
            overflow: 'auto',
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
        };

        debugContainer.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #800000;">Session Data</h3>
            <pre style="${Object.entries(preStyle).map(([k,v]) => `${k}:${v}`).join(';')}">
                ${JSON.stringify(userData, null, 2)}
            </pre>
            <button onclick="copySessionData()" style="
                margin-top: 10px;
                padding: 4px 8px;
                background: #800000;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">
                Copy to Clipboard
            </button>
        `;

        document.body.appendChild(debugContainer);
    }

    createDebugPanel();

    // Debug panel toggle hotkey
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            const debugDiv = document.getElementById('session-debug');
            debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Populate User Info
    document.getElementById('dashboard-username').textContent = `${userData.firstname} ${userData.lastname}`;
    document.getElementById('dashboard-email').textContent = userData.email;
    document.getElementById('profile-initial').textContent = userData.firstname[0];

    // Fetch and Render Events
    fetch('/src/Server/api/read_event.php')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('upcomingEvents');
        if (data.data?.length) {
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
                    
                    <button class=" w-fit join-event-btn px-4 py-2 font-medium text-white bg-gradient-to-t from-[#1F1616] to-[#EF0F0F] rounded-3xl hover:bg-white hover:text-black ">
                        Join Event
                    </button>
                </div>
                <div class="my-6 text-center">
                    <hr class="border-[#800000] border-t-2">
                </div>
            `).join('');
        }
    })
    .catch(error => console.error('Error loading events:', error));

    document.addEventListener('click', async (e) => {
        if (e.target.closest('.join-event-btn')) {
            const eventCard = e.target.closest('.event-card');
            const eventId = eventCard.dataset.eventId;
            const userData = JSON.parse(sessionStorage.getItem('userData'));
    
            // Refresh debug panel
            document.querySelector('#session-debug pre').textContent = JSON.stringify(userData, null, 2);
    
            if (!userData) {
                alert('Please log in to join events.');
                window.location.href = '/login.html';
                return;
            }
    
            // Fixed organization check
            if (!userData.org_ids || userData.org_ids.length === 0) {
                alert('You need to be part of an organization to join events');
                return;
            }
    
            try {
                const joinPayload = {
                    event_id: eventId,
                    student_id: userData.student_id,
                    // Use first org ID from array
                    org_id: userData.org_ids[0], 
                    is_attending: true,
                    added_at: new Date().toISOString(),
                    visibility_status: 'public'
                };
    
                console.group('Event Join Attempt');
                console.log('Payload:', joinPayload);
    
                const response = await fetch('/src/Server/api/calendar_add.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(joinPayload)
                });
    
                const result = await response.json();
                console.groupEnd();
    
                if (response.ok) {
                    e.target.disabled = true;
                    e.target.textContent = 'Joined!';
                    e.target.classList.remove('bg-gradient-to-t', 'from-[#1F1616]', 'to-[#EF0F0F]');
                    e.target.classList.add('bg-green-500', 'hover:bg-green-500');
                    alert('Successfully joined event!');
                } else {
                    const errorMessage = result.message || 'Unknown error occurred';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Event Join Error:', error);
                alert(`Failed to join event: ${error.message}`);
            }
        }
    });
});

// Global copy function
function copySessionData() {
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
    navigator.clipboard.writeText(JSON.stringify(userData, null, 2))
        .then(() => alert('Session data copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
}
