async function handleRegister(event) {
    event.preventDefault();

    // Collect input values from the form
    const studentid = document.getElementById('studentid').value.trim();
    const firstname = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const account_type = "User"; // Default value, update as needed or fetch from a dropdown if available

    // Validate required fields
    if (!studentid || !password) {
        alert("Student ID and Password are required.");
        return;
    }

    try {
        // Send the registration request to the backend
        const response = await fetch('http://localhost:3000/src/Server/api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentid,
                firstname,
                lastname,
                email,
                password,
                account_type,
            }),
        });

        const data = await response.json();

        if (response.status === 200) {
            alert("Registration successful!");
            window.location.href = "C:\laragon\www\OrgSync-Website\src\Client\script\login.js"; // Redirect to the login page
        } else {
            alert(data.message || "Registration failed. Please try again.");
        }
    } catch (error) {
        alert("An error occurred during registration. Please try again.");
        console.error(error);
    }
}

// Attach the registration function to the form's submit event
document.querySelector('form').addEventListener('submit', handleRegister);
