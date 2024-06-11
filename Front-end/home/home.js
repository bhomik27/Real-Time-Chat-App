document.addEventListener('DOMContentLoaded', async function () {
    const groupContainer = document.querySelector('.group-container');
    const userContainer = document.querySelector('.user-container');

    // Function to fetch and display groups
    async function fetchAndDisplayGroups() {
        groupContainer.innerHTML = '<h2>Groups</h2>';
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://13.233.193.120//group/getallgroups', { headers: { "Authorization": token } });
    
            // Ensure response.data.groups exists and is an array
            if (response.data && Array.isArray(response.data.groups)) {
                response.data.groups.forEach(group => {
                    // Create a div for each group
                    const groupDiv = document.createElement('div');
                    groupDiv.classList.add('group');
    
                    // Create a heading for group name
                    const groupNameHeading = document.createElement('h3');
                    groupNameHeading.textContent = group.name;
                    groupNameHeading.classList.add('group-name');
                    groupDiv.appendChild(groupNameHeading);
    
                    // Add click event listener to each group div
                    groupDiv.addEventListener('click', async function (event) {
                        event.preventDefault(); // Prevent default anchor behavior
                    });
    
                    groupContainer.appendChild(groupDiv);
                });
            } else {
                console.error('Invalid response format or no groups found:', response.data);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    }
    

    // Function to fetch and display online users
    async function fetchAndDisplayOnlineUsers() {
        userContainer.innerHTML = '<h2>Online Users</h2>'; // Display group name

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://13.233.193.120//user/getAllLoggedinUsers', { headers: { "Authorization": token } });

            if (response.data && Array.isArray(response.data.loggedinusers)) {
                const onlineUsers = response.data.loggedinusers;
                if (onlineUsers.length > 0) {
                    // Create a parent container for online users
                    const onlineUsersContainer = document.createElement('div');
                    onlineUsersContainer.classList.add('online-users');

                    onlineUsers.forEach(user => {
                        // Create a div for each online user
                        const userDiv = document.createElement('div');
                        userDiv.classList.add('online-user');

                        // Add user name
                        userDiv.textContent = user.name; // Assuming 'name' is the property for user's name

                        // Append a green dot for online users
                        const dot = document.createElement('span');
                        dot.classList.add('online-dot');
                        userDiv.appendChild(dot);

                        // Append the user div to the online users container
                        onlineUsersContainer.appendChild(userDiv);
                    });

                    // Append the online users container to the chat container
                    userContainer.appendChild(onlineUsersContainer);
                } else {
                    console.log('No online users found.');
                }
            } else {
                console.error('Invalid response format: ', response.data);
            }
        } catch (error) {
            console.error('Error fetching online users:', error);
        }
    }

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

            const response = await axios.post('http://13.233.193.120//user/logout', { userId }, config);

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

    // Fetch and Display Online Users
    await fetchAndDisplayOnlineUsers();

    // Fetch and Display Groups
    await fetchAndDisplayGroups();
});
