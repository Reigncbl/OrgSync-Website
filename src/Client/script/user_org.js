document.addEventListener('DOMContentLoaded', () => {
    // User Authentication Check
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        window.location.href = '/login.html';
        return;
    }

    // Fetch data from the server
    fetch('/src/Server/api/read_org.php')
        .then(response => response.json())
        .then(responseData => {
            const data = responseData.data;

            // Ensure that the containers exist before trying to append
            const joinOrgContainer = document.getElementById('join_org');
            const availOrgContainer = document.getElementById('avail_org');

            if (!joinOrgContainer || !availOrgContainer) {
                console.error('Could not find the join_org or avail_org containers in the HTML.');
                return;
            }

            // Check if the data is an array and userData has an org_id
            if (Array.isArray(data)) {
                // Find the organization data that matches the user's org_id
                const orgData = data.find(org => org.org_id === userData.org_id);

                // If org_id matches, display the organization details in the join_org container
                if (orgData) {
                    // Create the card structure for the joined organization
                    const joinOrgCard = document.createElement('div');
                    joinOrgCard.className = 'w-64 p-4 h-full bg-white rounded-3xl flex flex-col justify-between items-center space-y-4 shadow-md';

                    joinOrgCard.innerHTML = `
                        <div class="flex flex-col space-y-4 w-full">
                            <img src="/src/Client/img/${orgData.org_logo || 'default_logo.png'}" alt="${orgData.org_name}" class="w-full h-48 rounded-2xl bg-gray-200 object-cover">
                            <h3 class="text-2xl font-semibold text-center">${orgData.org_name || 'Untitled Organization'}</h3>
                        </div>
                        <button class="w-full p-4 bg-[#F0C9C9] rounded-xl hover:bg-[#ce5a5a] font-semibold follow-btn" data-org-id="${orgData.org_id}">Following</button>
                    `;
                    
                    // Append the card to join_org container
                    joinOrgContainer.appendChild(joinOrgCard);
                } else {
                    console.warn('No matching organization found for join_org.');
                }

                // Loop through all organizations and display them in avail_org (excluding the matching org)
                data.forEach(org => {
                    if (org.org_id !== userData.org_id) {
                        // Create card structure for each available organization
                        const orgCard = document.createElement('div');
                        orgCard.className = 'w-64 p-4 h-full bg-white rounded-3xl flex flex-col justify-between items-center space-y-4 shadow-md';

                        orgCard.innerHTML = `
                            <div class="flex flex-col space-y-4 w-full">
                                <img src="/src/Client/img/${org.org_logo || 'default_logo.png'}" alt="${org.org_name}" class="w-full h-48 rounded-2xl bg-gray-200 object-cover">
                                <h3 class="text-2xl font-semibold text-center">${org.org_name || 'Untitled Organization'}</h3>
                            </div>
                            <button class="w-full p-4 bg-[#F0C9C9] rounded-xl hover:bg-[#ce5a5a] font-semibold follow-btn" data-org-id="${org.org_id}">Follow</button>
                        `;
                        
                        // Append the card to avail_org container
                        availOrgContainer.appendChild(orgCard);
                    }
                });
            } else {
                console.error('API response is not an array:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching organization data:', error);
        });

    // Handle Follow Button Clicks
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.follow-btn')) {
            const followBtn = e.target;
            const orgId = followBtn.dataset.orgId;
            
            // Ensure the user is authenticated
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            if (!userData) {
                alert('Please log in to follow an organization.');
                window.location.href = '/login.html';
                return;
            }

            // Prepare the payload for the follow request
            const followPayload = {
                org_id: orgId,
                student_id: userData.student_id,
                followed_at: new Date().toISOString()
            };

            try {
                // Send the follow request to the server
                const response = await fetch('/src/Server/api/follow_org.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(followPayload)
                });

                const result = await response.json();
                
                if (response.ok) {
                    // Change the button text to "Following" and disable the button
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
