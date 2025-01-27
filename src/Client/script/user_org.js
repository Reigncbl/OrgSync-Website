document.addEventListener('DOMContentLoaded', () => {
    // 1. User Authentication Check
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        window.location.href = '/login.html';
        return;
    }

    // 2. Debug Panel for Session Data
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
            <pre style="${Object.entries(preStyle).map(([k, v]) => `${k}:${v}`).join(';')}">
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

    // 3. Debug Panel Toggle Hotkey (Ctrl + Shift + D)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            const debugDiv = document.getElementById('session-debug');
            debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
        }
    });

    // 4. Display User Profile Information
    if (userData && userData.firstname) {
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = userData.firstname;
        } else {
            console.warn('Element with ID "username" not found.');
        }

        const dashboardUsernameElement = document.getElementById('dashboard-username');
        const dashboardEmailElement = document.getElementById('dashboard-email');

        if (dashboardUsernameElement && dashboardEmailElement) {
            dashboardUsernameElement.textContent = userData.firstname;
            dashboardEmailElement.textContent = userData.email;
        } else {
            console.warn('One or more profile elements not found in the HTML.');
        }

        console.log('User data loaded from sessionStorage:', userData);
    } else {
        console.warn('User data incomplete or missing firstname in sessionStorage.');
    }

    // 5. Fetch Organization Data from Server
    fetch('/src/Server/api/read_org.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            const data = responseData.data;
            const joinOrgContainer = document.getElementById('join_org');
            const availOrgContainer = document.getElementById('avail_org');

            if (!joinOrgContainer || !availOrgContainer) {
                console.error('Could not find the join_org or avail_org containers in the HTML.');
                return;
            }

            if (Array.isArray(data)) {
                // Display Joined Organizations
                const joinedOrgs = data.filter(org =>
                    Array.isArray(userData.org_ids) && userData.org_ids.includes(org.org_id)
                );

                if (joinedOrgs.length > 0) {
                    joinedOrgs.forEach(orgData => {
                        const joinOrgCard = document.createElement('div');
                        joinOrgCard.className = 'w-64 p-4 h-full bg-[#FBF2F2] border border-2 border-[#800000] rounded-3xl flex flex-col justify-between items-center space-y-4 shadow-md';
                        joinOrgCard.innerHTML = `
                            <div class="flex flex-col space-y-4 w-full">
                                <img src="/src/Client/img/${orgData.org_logo || 'default_logo.png'}" alt="${orgData.org_name}" class="w-full h-48 rounded-2xl bg-gray-200 object-cover">
                                <h3 class="text-2xl font-semibold text-center">${orgData.org_name || 'Untitled Organization'}</h3>
                            </div>
                            <button class="w-full p-4 border-2 border-[#F0C9C9] rounded-xl hover:bg-[#ce5a5a] font-semibold follow-btn" data-org-id="${orgData.org_id}">Following</button>
                        `;
                        joinOrgContainer.appendChild(joinOrgCard);
                    });
                } else {
                    console.warn('No matching organizations found for join_org.');
                }

                // Display Available Organizations
                data.forEach(org => {
                    if (!Array.isArray(userData.org_ids) || !userData.org_ids.includes(org.org_id)) {
                        const orgCard = document.createElement('div');
                        orgCard.className = 'w-64 p-4 h-full bg-white rounded-3xl border border-2 border-[#800000] flex flex-col justify-between items-center space-y-4 shadow-md';
                        orgCard.innerHTML = `
                            <div class="flex flex-col space-y-4 w-full">
                                <img src="/src/Client/img/${org.org_logo || 'default_logo.png'}" alt="${org.org_name}" class="w-full h-48 rounded-2xl bg-gray-200 object-cover">
                                <h3 class="text-2xl font-semibold text-center">${org.org_name || 'Untitled Organization'}</h3>
                            </div>
                            <button class="w-full p-4 border-2 border-[#F0C9C9] rounded-xl hover:bg-[#ce5a5a] font-semibold follow-btn" data-org-id="${org.org_id}">Follow</button>
                        `;
                        availOrgContainer.appendChild(orgCard);
                    }
                });
            } else {
                console.error('API response is not an array:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching organization data:', error);
            alert('Failed to load organization data. Please try again later.');
        });

    // 6. Handle Follow Button Clicks
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.follow-btn')) {
            const followBtn = e.target;
            const orgId = followBtn.dataset.orgId;

            if (!userData) {
                alert('Please log in to follow an organization.');
                window.location.href = '/login.html';
                return;
            }

            const followPayload = {
                org_id: orgId,
                student_id: userData.student_id,
                followed_at: new Date().toISOString()
            };

            try {
                const response = await fetch('/src/Server/api/follow_org.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(followPayload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    followBtn.textContent = 'Following';
                    followBtn.disabled = true;
                    followBtn.classList.remove('bg-[#F0C9C9]', 'hover:bg-[#ce5a5a]');
                    followBtn.classList.add('bg-[#A3D9A5]', 'hover:bg-[#A3D9A5]');
                    alert('You are now following this organization!');
                } else {
                    throw new Error(result.message || 'Error following organization');
                }
            } catch (error) {
                console.error('Follow organization error:', error);
                alert(`Failed to follow organization: ${error.message}`);
            }
        }
    });
});