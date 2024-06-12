document.addEventListener('DOMContentLoaded', async function () {
    const groupContainer = document.querySelector('.group-container');
    const chatMessages = document.querySelector('.chat-messages');
    const chatHeader = document.querySelector('.chat-header');
    const messageInput = document.querySelector('#message-input');
    const sendButton = document.querySelector('#send-button');

    let selectedGroupId = null;

    // Fetch and display groups
    async function fetchAndDisplayGroups() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://13.233.193.120:3000/group/getallgroups', { headers: { "Authorization": token } });
            displayGroups(response.data.groupNames, response.data.groupIds);
        } catch (error) {
            handleFetchError('groups', error);
        }
    }

    // Display groups
    function displayGroups(groupNames, groupIds) {
        groupContainer.innerHTML = ''; // Clear previous content
        groupNames.forEach((groupName, index) => {
            const groupId = groupIds[index].groupId;
            const groupDiv = createGroupDiv(groupId, groupName);
            groupContainer.appendChild(groupDiv);
        });
    }

    // Handle fetch errors
    function handleFetchError(resource, error) {
        console.error(`Error fetching ${resource}:`, error);
        groupContainer.innerHTML = `<p>Error fetching ${resource}. Please try again later.</p>`;
    }

    // Create a group div
    function createGroupDiv(id, groupName) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('group');
        const groupNameHeading = document.createElement('h3');
        groupNameHeading.textContent = groupName;
        groupNameHeading.classList.add('group-name');
        groupDiv.appendChild(groupNameHeading);
        groupDiv.addEventListener('click', () => handleGroupClick(id, groupName));
        return groupDiv;
    }

    // Handle group click
    async function handleGroupClick(groupId, groupName) {
        selectedGroupId = groupId;
        chatHeader.textContent = groupName;
        await fetchAndDisplayGroupChats(groupId);
    }

    // Fetch and display chats for a group
    async function fetchAndDisplayGroupChats(groupId) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://13.233.193.120:3000/chat/getallchatsofgroup/${groupId}`, { headers: { "Authorization": token } });
            if (response.status === 200) {
                displayChats(response.data.chats);
            } else {
                console.error('Error fetching group chats:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching group chats:', error);
        }
    }

    // Display chats in the chat container
    function displayChats(chats) {
        chatMessages.innerHTML = ''; // Clear previous messages
        if (!Array.isArray(chats)) {
            console.error('Invalid chat data. Expected an array.');
            return;
        }
        chats.forEach(chat => {
            const messageContainer = createMessageContainer(chat);
            chatMessages.appendChild(messageContainer);
        });
    }

// Create a message container
function createMessageContainer(chat) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    // Default sender name if chat.User doesn't exist or has no name
    const senderName = chat.User && chat.User.name ? chat.User.name : 'Anonymous';

    const messageText = chat.message;
    const messageTime = formatMessageTime(chat.createdAt);

    messageContainer.innerHTML = `
        <div class="sender-name">${senderName}</div>
        <div class="message-text">${messageText}</div>
        <div class="message-time">${messageTime}</div>
    `;

    return messageContainer;
}

    

    // Format message time
    function formatMessageTime(createdAt) {
        const date = new Date(createdAt);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    // Send a message
    async function sendMessage(groupId, userId, message) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://13.233.193.120:3000/chat/createmessage/${groupId}/${userId}`,
                { message },
                { headers: { "Authorization": token } }
            );
            if (response.status === 200) {
                console.log('Message sent successfully');
                await fetchAndDisplayGroupChats(groupId);
                messageInput.value = ''; // Clear input field
            } else {
                console.error('Error sending message:', response.data);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    // Event listener for send button
    sendButton.addEventListener('click', async function (event) {
        event.preventDefault();
        const userId = localStorage.getItem('userId');
        const message = messageInput.value.trim();
        if (message !== '' && selectedGroupId) {
            await sendMessage(selectedGroupId, userId, message);
        } else {
            console.error('No group selected or message is empty');
        }
    });


    // Logout Functionality
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        // Assuming you have the user ID and token stored in localStorage
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        // Ensure that headers are correctly formatted
        const config = {
            headers: {
                "Authorization": token
            }
        };

        const response = await axios.post('http://13.233.193.120:3000/user/logout', { userId }, config);

        if (response.status === 200) {
            // Clear localStorage
            localStorage.clear();
            // Redirect to login page or any other appropriate page after successful logout
            window.location.href = '../login/login.html';
        } else {
            console.error('Logout failed:', response.data.message);
            // Handle logout failure
        }
    } catch (error) {
        console.error('Error during logout:', error.message);
        // Handle error, show error message to user, etc.
    }
});


    // Initial fetch and display of groups
    await fetchAndDisplayGroups();
});
