async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/src/Server/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('userData', JSON.stringify(data.user));
            const redirectUrl = data.user.account_type === 'Admin' 
                ? '/src/Client/scripts/admin.html' 
                : '/src/Client/scripts/user_dash.html';
            window.location.href = redirectUrl;
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

document.querySelector('form').addEventListener('submit', handleLogin);