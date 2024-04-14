document.addEventListener('DOMContentLoaded', async function () {
    const navbarToggle = document.getElementById('navbarToggle');
    const verticalNavbar = document.querySelector('.vertical-navbar');
    const sendButton = document.querySelector('.send-button');
    const messageInput = document.querySelector('.message-input input');
    const chatMessages = document.getElementById('chatMessages');

    // Function to fetch and display messages
    async function fetchAndDisplayMessages() {
        try {
            // Retrieve the authentication token from local storage
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Authentication token is missing.');
                return;
            }

            // Include the token in the request headers
            const config = {
                headers: {
                    Authorization: `${token}`
                }
            };

            // Send request to fetch messages
            const response = await axios.get('http://localhost:3000/chat/getallchats', config);

            // Clear previous messages
            chatMessages.innerHTML = '';

            // Display fetched messages
            if (response.data.chats) {
                response.data.chats.forEach(chat => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message');
                    messageDiv.innerText = chat.message;
                    chatMessages.appendChild(messageDiv);
                });
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    // Call fetchAndDisplayMessages initially when the page loads
    await fetchAndDisplayMessages();

    // Set interval to fetch messages every second
    setInterval(fetchAndDisplayMessages, 1000);

    // Add event listener for navbar toggle
    navbarToggle.addEventListener('click', function () {
        verticalNavbar.classList.toggle('show-navbar');
    });

    // Add event listener for send button
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
                await axios.post('http://localhost:3000/chat/createmessage', { message }, config);

                console.log('Message sent successfully');

                // After sending the message, fetch and display updated messages
                await fetchAndDisplayMessages();
            } catch (error) {
                // Handle errors
                console.error('Error sending message:', error);
            }
        }

        // Clear the input field after sending the message
        messageInput.value = '';
    });
});
