document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    if (!userData) {
        window.location.href = '/src/Client/scripts/login.html';
        return;
    }

    // Populate user info
    document.getElementById('user-name').textContent = `${userData.firstname} ${userData.lastname}`;
    document.getElementById('user-email').textContent = userData.email;
    document.getElementById('account-type').textContent = userData.account_type;

    // Add logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('userData');
        fetch('/src/Server/api/logout.php', {
            credentials: 'include'
        }).then(() => window.location.href = '/login.html');
    });
});