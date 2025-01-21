async function newsletter_handler(event) {
    event.preventDefault();
    const foreign_email = document.getElementById('foreign_email').value;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(foreign_email)) {
        alert('Please enter a valid email address.');
        return; // Prevent form submission
    }

    try {
        const response = await fetch('http://localhost:3000/src/Server/api/email.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foreign_email })
        });
    
        const data = await response.json();

        console.log('Response Data:', data);

        if (response.status === 200 || response.status === 201) {
            alert('Registration successful!');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
        console.error(error);
    }
}

document.querySelector('form').addEventListener('submit', newsletter_handler);
