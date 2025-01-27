document.addEventListener('DOMContentLoaded', () => {
    // Redirect if no user data found in sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        console.warn('No user data found in sessionStorage. Redirecting to login page.');
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

    // Extract `org_id` from userData
    const userOrgId = userData.org_id;
    if (!userOrgId) {
        console.error('org_id not found in user data:', userData);
        return;
    }

    // Function to render events
    function renderEvents(events) {
        const eventListContainer = document.getElementById('admin-event');
        if (!eventListContainer) {
            console.error('Missing event list container');
            return;
        }

        // Filter events by org_id
        const filteredEvents = events.filter(event => event.org_id === userOrgId);
        console.log('Filtered events:', filteredEvents);

        if (filteredEvents.length > 0) {
            const eventCards = filteredEvents.map(event => `
                <div class="bg-white p-4 shadow rounded-lg flex items-center">
                    <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        <span class="font-bold text-lg">${event.date || 'N/A'}</span>
                    </div>
                    <div class="ml-4">
                        <h3 class="font-bold text-lg">${event.event_title || 'Untitled Event'}</h3>
                        <p class="text-sm text-gray-600">${event.location || 'No Location'} | ${event.date_started || 'N/A'} – ${event.date_ended || 'N/A'}</p>
                        <p class="text-sm text-gray-600">Organized by: ${event.org_name || 'Unknown Organization'}</p>
                    </div>
                    <div class="ml-auto">
                        <button class="px-4 py-2 bg-[#E73030] text-white rounded-lg hover:bg-red-700 transition">
                            View Details
                        </button>
                    </div>
                </div>
            `).join('');
            eventListContainer.innerHTML = eventCards;
        } else {
            console.warn('No events found for org_id:', userOrgId);
            eventListContainer.innerHTML = '<p>No events found.</p>';
        }
    }

    // Fetch and render events
    fetch('/src/Server/api/read_event.php')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Use text first to debug issues
        })
        .then((responseText) => {
            try {
                const data = JSON.parse(responseText); // Parse as JSON
                console.log('Fetched event data:', data);
                renderEvents(data.data || []);
            } catch (err) {
                console.error('Error parsing JSON:', err, responseText);
            }
        })
        .catch((error) => console.error('Error fetching events:', error));

    // Toggle sub-links visibility
    const databaseLink = document.getElementById('database-link');
    const subLinks = document.getElementById('sub-links');
    if (databaseLink && subLinks) {
        databaseLink.addEventListener('click', () => {
            subLinks.classList.toggle('hidden');
        });
    }
});