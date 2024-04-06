document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('response-message');

    form.addEventListener('submit', login);

    async function login(event) {
        event.preventDefault();

        try {
            // Fetch input values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Construct loginData object
            const loginData = { email, password };

            // Send loginData to the backend
            const response = await axios.post("http://localhost:3000/user/login", loginData);

            // Clear input fields after successful login
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';

            // Display success message
            alert("Login successful!");
        } catch (error) {
            // Handle errors
            if (error.response && error.response.status === 401) {
                // If the status code is 401 (Unauthorized), display error message
                errorMessage.textContent = "Invalid email or password";
                errorMessage.style.display = 'block';
            } else {
                // Log other errors to the console
                console.error(error.response ? error.response.data : error.message);
            }
        }
    }
});
