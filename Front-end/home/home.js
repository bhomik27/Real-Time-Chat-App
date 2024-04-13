document.addEventListener('DOMContentLoaded', function () {
    const navbarToggle = document.getElementById('navbarToggle');
    const verticalNavbar = document.querySelector('.vertical-navbar');

    navbarToggle.addEventListener('click', function () {
        verticalNavbar.classList.toggle('show-navbar');
    });

    const sendButton = document.querySelector('.send-button');
    const messageInput = document.querySelector('.message-input input');

    sendButton.addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        const message = messageInput.value.trim(); // Trim whitespace from message input

        // Retrieve the authentication token from local storage
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Authentication token is missing.');
            return;
        }

        if (message !== '') {
            try {
                // Include the token in the request headers
                const config = {
                    headers: {
                        Authorization: `${token}`
                    }
                };

                // Send the request with the authentication token included in the headers
                const response = await axios.post('http://localhost:3000/chat/createmessage', { message }, config);
                
                console.log('Message sent successfully:', response.data);
            } catch (error) {
                // Handle errors
                console.error('Error sending message:', error);
            }
        }

        // Clear the input field after sending the message
        messageInput.value = '';
    });
});
