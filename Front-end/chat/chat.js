// document.addEventListener('DOMContentLoaded', async function () {
//     const groupContainer = document.querySelector('.group-container');
//     const chatMessages = document.querySelector('.chat-messages');
//     const chatHeader = document.querySelector('.chat-header');
//     const messageInput = document.querySelector('#message-input');
//     const sendButton = document.querySelector('#send-button');
//     const logoutButton = document.getElementById('logoutButton');

//     let selectedGroupId = null;
//     let chatInterval = null;

//     // Fetch and display groups
//     async function fetchAndDisplayGroups() {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get('http://localhost:3000/group/getallgroups', { headers: { "Authorization": token } });
//             console.log(response);

//             // Ensure response structure matches the expectation
//             if (response.data && response.data.groups) {
//                 const groups = response.data.groups;
//                 const groupNames = groups.map(group => group.name);
//                 const groupIds = groups.map(group => ({ groupId: group.id }));
//                 displayGroups(groupNames, groupIds);
//             } else {
//                 throw new Error("Invalid response structure");
//             }
//         } catch (error) {
//             handleFetchError('groups', error);
//         }
//     }

//     // Display groups
//     function displayGroups(groupNames, groupIds) {
//         groupContainer.innerHTML = ''; // Clear previous content
//         groupNames.forEach((groupName, index) => {
//             const groupId = groupIds[index].groupId;
//             const groupDiv = createGroupDiv(groupId, groupName);
//             groupContainer.appendChild(groupDiv);
//         });
//     }

//     // Handle fetch errors
//     function handleFetchError(resource, error) {
//         console.error(`Error fetching ${resource}:`, error);
//         groupContainer.innerHTML = `<p>Error fetching ${resource}. Please try again later.</p>`;
//     }

//     // Create a group div
//     function createGroupDiv(id, groupName) {
//         const groupDiv = document.createElement('div');
//         groupDiv.classList.add('group');
//         const groupNameHeading = document.createElement('h3');
//         groupNameHeading.textContent = groupName;
//         groupNameHeading.classList.add('group-name');
//         groupDiv.appendChild(groupNameHeading);
//         groupDiv.addEventListener('click', () => handleGroupClick(id, groupName));
//         return groupDiv;
//     }

//     // Handle group click
//     async function handleGroupClick(groupId, groupName) {
//         selectedGroupId = groupId;
//         chatHeader.textContent = groupName;
//         await fetchAndDisplayGroupChats(groupId);
//         setupRealTimeChat(groupId);
//     }

//     // Fetch and display chats for a group
//     async function fetchAndDisplayGroupChats(groupId) {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`http://localhost:3000/chat/getallchatsofgroup/${groupId}`, { headers: { "Authorization": token } });
//             if (response.status === 200) {
//                 displayChats(response.data.chats);
//             } else {
//                 console.error('Error fetching group chats:', response.statusText);
//             }
//         } catch (error) {
//             console.error('Error fetching group chats:', error);
//         }
//     }

//     // Display chats in the chat container
//     function displayChats(chats) {
//         chatMessages.innerHTML = ''; // Clear previous messages
//         if (!Array.isArray(chats)) {
//             console.error('Invalid chat data. Expected an array.');
//             return;
//         }
//         chats.forEach(chat => {
//             const messageContainer = createMessageContainer(chat);
//             chatMessages.appendChild(messageContainer);
//         });
//     }

//     // Create a message container
//     function createMessageContainer(chat) {
//         const messageContainer = document.createElement('div');
//         messageContainer.classList.add('message-container');

//         // Default sender name if chat.User doesn't exist or has no name
//         const senderName = chat.User && chat.User.name ? chat.User.name : 'Anonymous';

//         const messageText = chat.message;
//         const messageTime = formatMessageTime(chat.createdAt);

//         messageContainer.innerHTML = `
//             <div class="sender-name">${senderName}</div>
//             <div class="message-text">${messageText}</div>
//             <div class="message-time">${messageTime}</div>
//         `;

//         return messageContainer;
//     }

//     // Format message time
//     function formatMessageTime(createdAt) {
//         const date = new Date(createdAt);
//         return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
//     }

//     // Send a message
//     async function sendMessage(groupId, userId, message) {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.post(
//                 `http://localhost:3000/chat/createmessage/${groupId}/${userId}`,
//                 { message },
//                 { headers: { "Authorization": token } }
//             );
//             if (response.status === 200) {
//                 console.log('Message sent successfully');
//                 await fetchAndDisplayGroupChats(groupId);
//                 messageInput.value = ''; // Clear input field
//             } else {
//                 console.error('Error sending message:', response.data);
//             }
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     }

//     // Setup real-time chat updates
//     function setupRealTimeChat(groupId) {
//         if (chatInterval) {
//             clearInterval(chatInterval);
//         }
//         chatInterval = setInterval(() => fetchAndDisplayGroupChats(groupId), 10000);
//     }

//     // Event listener for send button
//     sendButton.addEventListener('click', async function (event) {
//         event.preventDefault();
//         const userId = localStorage.getItem('userId');
//         const message = messageInput.value.trim();
//         if (message !== '' && selectedGroupId) {
//             await sendMessage(selectedGroupId, userId, message);
//         } else {
//             console.error('No group selected or message is empty');
//         }
//     });

//     // Logout Functionality
//     logoutButton.addEventListener('click', async () => {
//         try {
//             const userId = localStorage.getItem('userId');
//             const token = localStorage.getItem('token');

//             const config = {
//                 headers: {
//                     "Authorization": token
//                 }
//             };

//             const response = await axios.post('http://localhost:3000/user/logout', { userId }, config);

//             if (response.status === 200) {
//                 localStorage.clear();
//                 window.location.href = '../login/login.html';
//             } else {
//                 console.error('Logout failed:', response.data.message);
//             }
//         } catch (error) {
//             console.error('Error during logout:', error.message);
//         }
//     });

//     // Initial fetch and display of groups
//     await fetchAndDisplayGroups();
// });


document.addEventListener('DOMContentLoaded', async function () {
    const groupContainer = document.querySelector('.group-container');
    const chatMessages = document.querySelector('.chat-messages');
    const chatHeader = document.querySelector('.chat-header');
    const messageInput = document.querySelector('#message-input');
    const sendButton = document.querySelector('#send-button');
    const fileInput = document.querySelector('#file-input');
    const sendFileButton = document.querySelector('#send-file-button');
    const logoutButton = document.getElementById('logoutButton');

    let selectedGroupId = null;
    const socket = io('http://localhost:3000');

    // Fetch and display groups
    async function fetchAndDisplayGroups() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/group/getallgroups', { headers: { "Authorization": token } });

            if (response.data && response.data.groups) {
                const groups = response.data.groups;
                displayGroups(groups);
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (error) {
            handleFetchError('groups', error);
        }
    }

    function displayGroups(groups) {
        groupContainer.innerHTML = ''; 
        groups.forEach(group => {
            const groupDiv = createGroupDiv(group.id, group.name);
            groupContainer.appendChild(groupDiv);
        });
    }

    function handleFetchError(resource, error) {
        console.error(`Error fetching ${resource}:`, error);
        groupContainer.innerHTML = `<p>Error fetching ${resource}. Please try again later.</p>`;
    }

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

    async function handleGroupClick(groupId, groupName) {
        selectedGroupId = groupId;
        chatHeader.textContent = groupName;
        await fetchAndDisplayGroupChats(groupId);
        await fetchAndDisplayGroupFiles(groupId);

        socket.emit('joinGroup', groupId);
    }

    async function fetchAndDisplayGroupChats(groupId) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/chat/getallchatsofgroup/${groupId}`, { headers: { "Authorization": token } });
            if (response.status === 200) {
                displayChats(response.data.chats);
            } else {
                console.error('Error fetching group chats:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching group chats:', error);
        }
    }

    function displayChats(chats) {
        chatMessages.innerHTML = '';
        if (!Array.isArray(chats)) {
            console.error('Invalid chat data. Expected an array.');
            return;
        }
        chats.forEach(chat => {
            const messageContainer = createMessageContainer(chat);
            chatMessages.appendChild(messageContainer);
        });
    }

    function createMessageContainer(chat) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');

        const senderName = localStorage.getItem('name');
        const messageText = chat.message;
        const messageTime = formatMessageTime(chat.createdAt);

        messageContainer.innerHTML = `
            <div class="sender-name">${senderName}</div>
            <div class="message-text">${messageText}</div>
            <div class="message-time">${messageTime}</div>
        `;

        return messageContainer;
    }

    function formatMessageTime(createdAt) {
        const date = new Date(createdAt);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    sendButton.addEventListener('click', async function (event) {
        event.preventDefault();
        const userId = localStorage.getItem('userId');
        const message = messageInput.value.trim();
        if (message !== '' && selectedGroupId) {
            socket.emit('sendMessage', { groupId: selectedGroupId, userId, message });
            messageInput.value = '';
        } else {
            console.error('No group selected or message is empty');
        }
    });

    sendFileButton.addEventListener('click', async function (event) {
        event.preventDefault();
        if (fileInput.files.length > 0 && selectedGroupId) {
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('groupId', selectedGroupId);

            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:3000/file/createfile', formData, {
                    headers: {
                        "Authorization": token,
                        "Content-Type": "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    socket.emit('sendFile', { groupId: selectedGroupId, file: response.data.file });
                } else {
                    console.error('Error uploading file:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            console.error('No file selected or no group selected');
        }
    });

    async function fetchAndDisplayGroupFiles(groupId) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/file/getallfiles/${groupId}`, { headers: { "Authorization": token } });
            if (response.status === 200) {
                displayFiles(response.data.files);
            } else {
                console.error('Error fetching group files:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching group files:', error);
        }
    }

    function displayFiles(files) {
        files.forEach(file => {
            const fileContainer = createFileContainer(file);
            chatMessages.appendChild(fileContainer);
        });
    }

    function createFileContainer(file) {
        const fileContainer = document.createElement('div');
        fileContainer.classList.add('file-container');

        const fileLink = document.createElement('a');
        fileLink.href = file.url;
        fileLink.textContent = 'Download File';
        fileLink.target = 'file.url';

        fileContainer.appendChild(fileLink);
        return fileContainer;
    }

    socket.on('newMessage', (chat) => {
        if (chat.groupId === selectedGroupId) {
            const messageContainer = createMessageContainer(chat);
            chatMessages.appendChild(messageContainer);
        }
    });

    socket.on('newFile', (file) => {
        if (file.groupId === selectedGroupId) {
            const fileContainer = createFileContainer(file);
            chatMessages.appendChild(fileContainer);
        }
    });

    logoutButton.addEventListener('click', async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            const config = { headers: { "Authorization": token } };
            const response = await axios.post('http://localhost:3000/user/logout', { userId }, config);

            if (response.status === 200) {
                localStorage.clear();
                window.location.href = '../login/login.html';
            } else {
                console.error('Logout failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    });

    await fetchAndDisplayGroups();
});
