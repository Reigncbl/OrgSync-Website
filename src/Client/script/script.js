// Fetch organization data from the server
fetch('/src/Server/api/read_org.php')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Check what data is being fetched
    if (data.data && data.data.length > 0) {
      const orgListContainer = document.getElementById('organization-list');
      orgListContainer.innerHTML = ''; // Clear the container before adding new data

      // Create organization cards dynamically
      const orgCards = data.data.map(org => {
        return `
          <div class="w-64 p-4 bg-white rounded-3xl flex flex-col items-center justify-between space-y-4 shadow-md">
            <div class="flex flex-col space-y-4">
              <img src="/src/Client/img/${org.logo}" alt="${org.name}" 
                   class="w-full h-48 rounded-2xl bg-gray-200 object-cover">
              <h3 class="text-2xl font-semibold text-center">${org.name}</h3>
            </div>
            <button class="w-full p-4 bg-[#F0C9C9] rounded-xl hover:bg-[#ce5a5a] font-semibold" data-org-id="${org.id}">Learn More</button>
          </div>
        `;
      }).join(''); // Combine all the card HTML into a single string

      orgListContainer.innerHTML = orgCards; // Inject the cards into the container

      // Add click event listeners to the "Learn More" buttons
      document.querySelectorAll('button[data-org-id]').forEach(button => {
        button.addEventListener('click', function () {
          const orgId = this.getAttribute('data-org-id');
          const orgDetails = data.data.find(org => org.id == orgId);

          // Hide the organization list and show the detailed view
          document.getElementById('organization-list').classList.add('hidden');
          const orgDetailContent = document.getElementById('orgDetailContent');
          orgDetailContent.innerHTML = `
            <div class="flex space-x-8 justify-center p-8">
                <img src="/src/Client/img/${orgDetails.logo}" alt="${orgDetails.name}" class="h-40 w-48 object-cover">
                <div class="flex flex-col space-y-4">
                    <h1 class="text-5xl font-bold">${orgDetails.name}</h1>
                    <div class="flex justify-between items-center">
                        <button class="button bg-gradient-to-t from-[#F0C9C9] to-[#D9D9D9] text-black font-semibold text-lg p-5 px-7">Follow</button>
                        <div class="flex space-x-6 items-center justify-center">
                            <a href="${orgDetails.facebook}"><i class="fa-brands fa-facebook text-4xl"></i></a>
                            <a href="${orgDetails.instagram}"><i class="fa-brands fa-instagram text-4xl"></i></a>
                            <a href="${orgDetails.linkedin}"><i class="fa-brands fa-linkedin text-4xl"></i></a>
                        </div>
                    </div>
                    <p class="text-md font-medium bg-[#FBF2F2] rounded-2xl p-6">${orgDetails.description}</p>
                </div>
            </div>
          `;

          // Show the detailed view
          document.getElementById('organization-detail').classList.remove('hidden');
        });
      });
    } else {
      document.getElementById('organization-list').innerHTML = '<p>No organizations found.</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching organizations:', error);
    document.getElementById('organization-list').innerHTML = '<p>Error fetching organizations. Please try again later.</p>';
  });

// Add event listener to "Login" buttons
document.querySelectorAll('.loginBtn').forEach(button => {
  button.addEventListener('click', function () {
    window.location.href = './scripts/login.html';
  });
});

// Optional: Implement "Back to List" functionality if needed
document.getElementById('backBtn')?.addEventListener('click', function () {
  document.getElementById('organization-list').classList.remove('hidden');
  document.getElementById('organization-detail').classList.add('hidden');
});
