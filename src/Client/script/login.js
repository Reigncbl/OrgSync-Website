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
            window.location.href = '/src/Client/home.html';

        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('An error occurred. Please tr1231qweqwe3y again.');
        console.error(error);
    }
}

document.querySelector('form').addEventListener('submit', handleLogin);
