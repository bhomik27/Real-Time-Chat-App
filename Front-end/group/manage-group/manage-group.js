document.addEventListener('DOMContentLoaded', async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const groupId = urlParams.get('groupId');
        const token = localStorage.getItem('token');

        // Fetch group details
        const groupDetailsResponse = await axios.get(`http://13.233.193.120:3000//group/showGroupDetails/${groupId}`, {
            headers: { "Authorization": token }
        });
        const groupDetails = groupDetailsResponse.data;

        // Display group details
        displayGroupDetails(groupDetails);

        // Setup search functionality
        setupSearch();

    } catch (error) {
        console.error("Error fetching group details:", error);
    }
});

// function displayGroupDetails(groupDetails) {
//     const { groupName, groupDescription, adminId, createdAt, members } = groupDetails;

//     // Display group details
//     document.getElementById('group-name').textContent = groupName;
//     document.getElementById('group-description').textContent = groupDescription || "No description available";
//     document.getElementById('created-by').textContent = adminId || "No admin assigned";
//     document.getElementById('created-at').textContent = new Date(createdAt).toLocaleString();

//     // Display group members
//     const memberList = document.getElementById('member-list');
//     if (memberList) {
//         memberList.innerHTML = ''; // Clear previous list
//         if (members.length > 0) {
//             members.forEach(member => {
//                 const li = document.createElement('li');
//                 li.textContent = member.name;

//                 // Add remove button
//                 const removeButton = createButton('X', async () => {
//                     await removeMember(member.id);
//                 });
//                 li.appendChild(removeButton);

//                 // Add make admin button
//                 const makeAdminButton = createButton('Make Admin', async () => {
//                     await makeAdmin(member.id);
//                 });
//                 li.appendChild(makeAdminButton);

//                 memberList.appendChild(li);
//             });
//         } else {
//             const li = document.createElement('li');
//             li.textContent = "No members in this group";
//             memberList.appendChild(li);
//         }
//     }
// }


function displayGroupDetails(groupDetails) {
    const { groupName, groupDescription, adminNames, createdAt, members } = groupDetails;

    // Display group details
    document.getElementById('group-name').textContent = groupName;
    document.getElementById('group-description').textContent = groupDescription || "No description available";
    document.getElementById('created-by').textContent = adminNames || "No admin assigned";
    document.getElementById('created-at').textContent = new Date(createdAt).toLocaleString();

    // Display group members
    const memberList = document.getElementById('member-list');
    if (memberList) {
        memberList.innerHTML = ''; // Clear previous list
        if (members.length > 0) {
            members.forEach(member => {
                const li = document.createElement('li');
                li.textContent = member.name;

                // Add remove button
                const removeButton = createButton('X', async () => {
                    await removeMember(member.id);
                });
                li.appendChild(removeButton);

                // Add make admin button
                const makeAdminButton = createButton('Make Admin', async () => {
                    await makeAdmin(member.id);
                });
                li.appendChild(makeAdminButton);

                memberList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "No members in this group";
            memberList.appendChild(li);
        }
    }
}





function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    return button;
}

async function setupSearch() {
    const searchInput = document.getElementById('search-box');
    if (!searchInput) {
        console.error("Element with ID 'search-box' not found.");
        return;
    }

    searchInput.addEventListener('input', async function (event) {
        const searchTerm = event.target.value.toLowerCase();

        try {
            const token = localStorage.getItem('token');

            // Call the searchUsersByUsername endpoint to get user search results
            const searchResult = await axios.get(`http://13.233.193.120:3000//group/searchUsersByUsername?searchTerm=${searchTerm}`,  {
                headers: { "Authorization": token }
            });

            console.log(searchResult);

            displaySearchResults(searchResult.data);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    });
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) {
        console.error("Element with ID 'search-results' not found.");
        return;
    }

    searchResults.innerHTML = ''; // Clear previous results
    if (results.length > 0) {
        results.forEach(member => {
            const div = document.createElement('div');
            div.classList.add('input-group', 'mb-3');

            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('form-control');
            input.value = member.name;
            input.disabled = true;

            const addButton = createButton('+', async () => {
                await addMember(member.id);  // Pass the correct user ID
            });

            div.appendChild(input);
            div.appendChild(addButton);
            searchResults.appendChild(div);
        });
    } else {
        const div = document.createElement('div');
        div.textContent = "No matching members found";
        searchResults.appendChild(div);
    }
}

async function addMember(userId) {
    const groupId = new URLSearchParams(window.location.search).get('groupId');
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`http://13.233.193.120:3000//group/${groupId}/add-member`, 
        { user_id: userId },  // Pass user_id in the body
        {
            headers: { "Authorization": token }
        });
        console.log("Response from server:", response.data);
        window.location.reload()
        // Refresh search results after adding member
        const searchTerm = document.getElementById('search-box').value.toLowerCase();
        const searchResult = await axios.get(`http://13.233.193.120:3000//group/searchUsersByUsername?searchTerm=${searchTerm}`, {
            headers: { "Authorization": token }
        });
        displaySearchResults(searchResult.data);
    } catch (error) {
        console.error("Error adding member:", error);
    }
}

async function removeMember(memberId) {
    const groupId = new URLSearchParams(window.location.search).get('groupId');

    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://13.233.193.120:3000//group/${groupId}/remove-member/${memberId}`, {
            headers: { "Authorization": token }
        });
        console.log("Response from server:", response.data);
        // Refresh group details after removing member
        const groupDetailsResponse = await axios.get(`http://13.233.193.120:3000//group/showGroupDetails/${groupId}`, {
            headers: { "Authorization": token }
        });
        const groupDetails = groupDetailsResponse.data;
        displayGroupDetails(groupDetails);
    } catch (error) {
        console.error("Error removing member:", error);
    }
}

// async function makeAdmin(memberId) {
//     const groupId = new URLSearchParams(window.location.search).get('groupId');
//     const token = localStorage.getItem('token');
//     try {
//         await axios.put(`http://13.233.193.120:3000//group/${groupId}/make-admin`,
//         { memberId },
//         {
//             headers: { "Authorization": token }
//         });
//         // Refresh group details after making admin
//         const groupDetailsResponse = await axios.get(`http://13.233.193.120:3000//group/showGroupDetails/${groupId}`, {
//             headers: { "Authorization": token }
//         });
//         const groupDetails = groupDetailsResponse.data;
//         displayGroupDetails(groupDetails);
//     } catch (error) {
//         console.error("Error making member admin:", error);
//     }
// }

async function makeAdmin(memberId) {
    const groupId = new URLSearchParams(window.location.search).get('groupId');
    const token = localStorage.getItem('token');
    try {
        await axios.put(`http://13.233.193.120:3000//group/${groupId}/make-admin`, 
        { user_id: memberId }, // Pass user_id in the body
        {
            headers: { "Authorization": token }
            });
        
        alert(`${memberId} is now admin`);
        // Refresh group details after making admin
        const groupDetailsResponse = await axios.get(`http://13.233.193.120:3000//group/showGroupDetails/${groupId}`, {
            headers: { "Authorization": token }
        });
        const groupDetails = groupDetailsResponse.data;
        displayGroupDetails(groupDetails);
    } catch (error) {
        console.error("Error making member admin:", error);
    }
}


