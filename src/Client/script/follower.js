document.addEventListener('DOMContentLoaded', () => {
    // Redirect if no user data found in sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        console.warn('No user data found in sessionStorage. Redirecting to login page.');
        window.location.href = '/login.html';
        return;
    }

    // Extract `org_id` from userData
    const userOrgId = userData.org_id;
    if (!userOrgId) {
        console.error('org_id not found in user data:', userData);
        return;
    }

    // Debug: Log user org_id
    console.log('User org_id:', userOrgId);

    function renderFollowers(followers) {
        const followerTableBody = document.getElementById('follower-table-body');
        if (!followerTableBody) {
            console.error('Missing table body for rendering followers');
            return;
        }
    
        // Filter followers by org_id
        const filteredFollowers = followers.filter(follower => follower.org_id === userOrgId);
        console.log('Filtered followers:', filteredFollowers);
    
        if (filteredFollowers.length > 0) {
            // Create table rows
            const rows = filteredFollowers.map(follower => `
                <tr class="text-center border-b">
                    <td class="p-2">${follower.student_id || 'N/A'}</td>
                    <td class="p-2">${follower.firstname || 'N/A'}</td>
                    <td class="p-2">${follower.lastname || 'N/A'}</td>
                    <td class="p-2">${follower.email || 'N/A'}</td>
                    <td class="p-2">${follower.account_type || 'N/A'}</td>
                    <td class="p-2">
                        <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" data-id="${follower.student_id}">
                            Edit
                        </button>
                        <button class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition" data-id="${follower.student_id}">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join('');
            followerTableBody.innerHTML = rows;
        } else {
            console.warn('No followers found for org_id:', userOrgId);
            followerTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center p-4 text-gray-500">No followers found.</td>
                </tr>
            `;
        }
    }
    
 
    // Fetch and render followers
    fetch('http://localhost:3000/src/Server/api/read_followers.php', {
        method: 'GET',
        credentials: 'include', // Ensures cookies/session info are sent
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Use text first to debug issues
        })
        .then((responseText) => {
            try {
                const data = JSON.parse(responseText); // Parse as JSON
                console.log('Fetched follower data:', data);

                if (data.status === 'success') {
                    renderFollowers(data.data || []);
                } else if (data.status === 'empty') {
                    console.warn('No followers data found:', data);
                    document.getElementById('follower-table-body').innerHTML =
                        '<tr><td colspan="7" class="text-center">No followers found</td></tr>';
                } else {
                    console.error('Unexpected status in response:', data.status);
                }
            } catch (err) {
                console.error('Error parsing JSON:', err, responseText);
            }
        })
        .catch((error) => {
            console.error('Error fetching followers:', error);
            document.getElementById('follower-table-body').innerHTML =
                '<tr><td colspan="7" class="text-center text-red-500">Error loading data</td></tr>';
        });

    // Toggle sub-links visibility
    const databaseLink = document.getElementById('database-link');
    const subLinks = document.getElementById('sub-links');
    if (databaseLink && subLinks) {
        databaseLink.addEventListener('click', () => {
            subLinks.classList.toggle('hidden');
        });
    }
});
