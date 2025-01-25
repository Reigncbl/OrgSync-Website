async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("Attempting login with:", { email, password }); // Debug log

    try {
        const response = await fetch('http://localhost:3000/src/Server/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        console.log("Login response:", data); // Debug log
        

        if (response.status === 200) {
            let redirectUrl;
            if (data.user.account_type === 'Admin') {
                redirectUrl = '/src/Client/scripts/admin.html';
            } else if (data.user.account_type === 'User') {
                redirectUrl = '/src/Client/scripts/dashboard.html';
            } else {
                console.warn("Unknown account type:", data.user.account_type); // Debug warning
                redirectUrl = '/src/Client/scripts/dashboard.html';
            }

            alert('Login successful!');
            window.location.href = redirectUrl;
        } else {
            console.error("Login failed:", data.message); // Debug error
            alert(data.message);
        }
    } catch (error) {
        console.error("Error during login:", error); // Debug error
        alert('An error occurred. Please try again.');
    }
}

document.querySelector('form').addEventListener('submit', handleLogin);
