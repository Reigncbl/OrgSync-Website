async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/src/Server/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.status === 200) {
            alert('Login successful!');
            window.location.href = 'C:\laragon\www\OrgSync-Website\src\Client\scripts\dashboard.html';

        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
        console.error(error);
    }
}

document.querySelector('form').addEventListener('submit', handleLogin);
