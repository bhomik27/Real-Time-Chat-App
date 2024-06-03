document.addEventListener('DOMContentLoaded', async function () {
    const groupContainer = document.querySelector('.group-container');
    const userContainer = document.querySelector('.user-container');

    // Fetches and displays all users
    async function displayAllUsers() {
        try {
            const userList = document.getElementById('user-list');
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/user/getallusers', {
                headers: { "Authorization": token }
            });
            const users = response.data.users;
            users.forEach(user => {
                const input_user = createUserCheckbox(user);
                userList.appendChild(input_user);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Creates a checkbox for a user
    function createUserCheckbox(user) {
        const input_user = document.createElement('input');
        input_user.type = 'checkbox';
        input_user.id = user.id;
        input_user.name = user.name;
        input_user.value = user.name;
        const label_user = document.createElement('label');
        label_user.htmlFor = user.id;
        label_user.textContent = user.name;
        const br = document.createElement('br');
        const userContainer = document.createElement('div');
        userContainer.appendChild(input_user);
        userContainer.appendChild(label_user);
        userContainer.appendChild(br);
        return userContainer;
    }

    // Handles form submission
    async function onSubmit(e) {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const group_name_input = document.getElementById('group-name');
            const group_description_input = document.getElementById('group-description').value;

            const selectedUsers = Array.from(document.querySelectorAll('#user-list input[type="checkbox"]:checked'))
                .map(user => user.id);

            const groupData = {
                group_name: group_name_input.value,
                group_description: group_description_input,
                users: selectedUsers
            };

            const response = await axios.post('http://localhost:3000/group/creategroup', groupData, {
                headers: { "Authorization": token }
            });

            console.log('Group created successfully:', response.data);
            alert("Group Created Successfully");
            location.reload();
        } catch (error) {
            console.error('Error creating group:', error);
        }
    }

    // Fetches and displays online users
    async function fetchAndDisplayOnlineUsers(groupName) {
        try {
            userContainer.innerHTML = `<h2>Online Users</h2>`;
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/user/getAllLoggedinUsers', {
                headers: { "Authorization": token }
            });
            console.log(response);
            const onlineUsers = response.data.loggedinusers.filter(user => user.group === groupName);
            if (onlineUsers.length > 0) {
                const onlineUsersContainer = document.createElement('div');
                onlineUsersContainer.classList.add('online-users');
                onlineUsers.forEach(user => {
                    const userDiv = createUserDiv(user.name);
                    onlineUsersContainer.appendChild(userDiv);
                });
                userContainer.appendChild(onlineUsersContainer);
            } else {
                console.log('No online users found for this group.');
            }
        } catch (error) {
            console.error('Error fetching online users:', error);
        }
    }

    // Creates a div for an online user
    function createUserDiv(userName) {
        const userDiv = document.createElement('div');
        userDiv.classList.add('online-user');
        userDiv.textContent = userName;
        const dot = document.createElement('span');
        dot.classList.add('online-dot');
        userDiv.appendChild(dot);
        return userDiv;
    }

    // Fetches and displays groups
    async function fetchAndDisplayGroups() {
        try {
            groupContainer.innerHTML = '<h2>Groups</h2>';
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/group/getallgroups', {
                headers: { "Authorization": token }
            });
            const groups = response.data.groups;
            groups.forEach(group => {
                const groupDiv = createGroupDiv(group.id, group.name);
                groupContainer.appendChild(groupDiv);
            });
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    }

    // Creates a div for a group with an edit button
    function createGroupDiv(groupId, groupName) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('group');
        const groupNameHeading = document.createElement('h3');
        groupNameHeading.textContent = groupName;
        groupNameHeading.classList.add('group-name');
        groupDiv.appendChild(groupNameHeading);
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', async function(event) {
            event.stopPropagation();
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/group/showGroupDetails/${groupId}`, { headers: { "Authorization": token } });

                console.log(response);
                
                window.location.href = `./manage-group/manage-group.html?groupId=${groupId}`;
            } catch (error) {
                console.error('Error managing group:', error);
            } 
        });
        groupDiv.appendChild(editButton);
        groupDiv.addEventListener('click', async function (event) {
            event.preventDefault();
            await fetchAndDisplayOnlineUsers(groupName);
        });
        return groupDiv;
    }

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function (event) {
        const searchTerm = event.target.value.toLowerCase();
        const checkboxes = document.querySelectorAll('#user-list input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const userName = checkbox.name.toLowerCase();
            const userContainer = checkbox.parentElement;
            userContainer.style.display = userName.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Event listener for form submission
    document.getElementById('my-form').addEventListener('submit', onSubmit);

    // Logout Functionality
    document.getElementById('logoutButton').addEventListener('click', async () => {
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

    // Initial function calls
    displayAllUsers();
    fetchAndDisplayOnlineUsers();
    fetchAndDisplayGroups();
});
