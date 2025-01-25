async function checkSession() {
    try {
        const response = await fetch('http://localhost:3000/src/Server/api/protected_page.php');

        console.log("Session check response:", response); // Debug log

        if (response.status === 401) {
            console.warn("Session expired or unauthorized"); // Debug warning
            window.location.href = '/src/Client/scripts/login.html';
        } else {
            const data = await response.json();
            console.log("Session active for user:", data.user); // Debug log
        }
    } catch (error) {
        console.error("Error during session check:", error); // Debug error
        alert('An error occurred while checking session. Please try again.');
    }
}

checkSession();
