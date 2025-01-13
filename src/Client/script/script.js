fetch('/src/Server/api/read_org.php')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Check what data is being fetched
    if (data.data && data.data.length > 0) {
      const orgListContainer = document.getElementById('organization-list');
      orgListContainer.innerHTML = ''; // Clear the container before adding new data

      const orgCards = data.data.map(org => {
        return `
          <div class="w-64 p-4 bg-white rounded-3xl flex flex-col items-center justify-between space-y-4 shadow-md">
            <div class="flex flex-col space-y-4">
              <img src="/src/Client/img/${org.logo}" alt="${org.name}" 
                   class="w-full h-48 rounded-2xl bg-gray-200 object-cover">
              <h3 class="text-2xl font-semibold text-center">${org.name}</h3>
            </div>
            <button class="w-full p-4 bg-[#F0C9C9] rounded-xl hover:bg-[#e4baba] transition-colors">Learn More</button>
          </div>
        `;
      }).join(''); // Combine all the card HTML into a single string

      orgListContainer.innerHTML = orgCards; // Inject the cards into the container
    } else {
      document.getElementById('organization-list').innerHTML = '<p>No organizations found.</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching organizations:', error);
    document.getElementById('organization-list').innerHTML = '<p>Error fetching organizations. Please try again later.</p>';
  });

document.getElementById('loginBtn').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default link behavior
  window.location.href = './script/login.html'; // Redirect to login.html
});
