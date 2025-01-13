const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');
const logo = document.getElementById('logo');
const userInfo = document.getElementById('user-info');
const userprofile = document.getElementById('user-profile');

        
toggleBtn.addEventListener('click', () => {
    // Toggle the width of the sidebar
    sidebar.classList.toggle('w-64');
    sidebar.classList.toggle('w-16');

    // Toggle visibility of logo and user info
    logo.classList.toggle('hidden');
    userInfo.classList.toggle('hidden');
    userprofile.classList.toggle('hidden');
            
    // Toggle icons
    document.getElementById('toggle-icon-open').classList.toggle('hidden');
    document.getElementById('toggle-icon-close').classList.toggle('hidden');
    document.getElementById('ellipsis').classList.toggle('hidden');

    // Toggle visibility of each sidebar item
    sidebarItems.forEach(item => {
        item.classList.toggle('hidden');
    });
});
