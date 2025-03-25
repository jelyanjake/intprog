let localUsers = [];

async function fetchInitialData() {
    try {
        const response = await fetch("https://reqres.in/api/users");
        if (!response.ok) throw new Error(`Failed to fetch users (Status: ${response.status})`);
        
        const result = await response.json();
        localUsers = result.data;
    } catch (error) {
        console.error("Error fetching initial data:", error);
        document.querySelector(".div2").innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Display function
function displayData(data) {
    const dataContainer = document.querySelector(".div2");
    dataContainer.innerHTML = ""; 

    if (Array.isArray(data)) {
        data.forEach(user => {
            dataContainer.innerHTML += `
                <div style="padding: 10px; margin: 5px;">
                    <img src="${user.avatar}" alt="User Avatar" style="width: 82px; height: 82px; border-radius: 50%;">
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Name:</strong> ${user.first_name} ${user.last_name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                </div>
            `;
        });
    } else {
        dataContainer.innerHTML = "<p>No data available</p>";
    }
}

// GET user(s)
function getData() {
    const userId = document.getElementById("id").value.trim();
    const firstName = document.getElementById("fname").value.trim().toLowerCase();
    const lastName = document.getElementById("lname").value.trim().toLowerCase();
    const email = document.getElementById("email").value.trim().toLowerCase();

    // If no input is provided, display all users
    if (!userId && !firstName && !lastName && !email) {
        displayData(localUsers);
        return;
    }

    let filteredUsers = localUsers;

    if (userId) {
        filteredUsers = localUsers.filter(user => user.id == userId);
    } else {
        filteredUsers = localUsers.filter(user =>
            (firstName && user.first_name.toLowerCase().includes(firstName)) ||
            (lastName && user.last_name.toLowerCase().includes(lastName)) ||
            (email && user.email.toLowerCase().includes(email))
        );
    }

    displayData(filteredUsers.length > 0 ? filteredUsers : "<p>No matching users found.</p>");
}

// POST new user
function postData() {
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const av = document.getElementById("av").files[0];

    if (!fname || !lname || !email) {
        alert("Please fill out all fields!");
        return;
    }

    const newUser = {
        id: localUsers.length ? localUsers[localUsers.length - 1].id + 1 : 1,
        first_name: fname,
        last_name: lname,
        email: email,
        avatar: av ? URL.createObjectURL(av) : `https://ui-avatars.com/api/?name=${fname}+${lname}`
    };

    localUsers.push(newUser);
    displayData([newUser]);
    alert("User Added Successfully!");
}

// PUT (update entire user record)
function putData() {
    const userId = document.getElementById("id").value.trim();
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!userId || !fname || !lname || !email) {
        alert("Please enter user ID and all details to update!");
        return;
    }

    let user = localUsers.find(user => user.id == userId);
    if (user) {
        user.first_name = fname;
        user.last_name = lname;
        user.email = email;
        displayData([user]);
    } else {
        alert("User not found!");
    }
}

// PATCH (update only email)
function patchData() {
    const userId = document.getElementById("id").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!userId || !email) {
        alert("Please enter user ID and email to update!");
        return;
    }

    let user = localUsers.find(user => user.id == userId);
    if (user) {
        user.email = email;
        displayData([user]);
    } else {
        alert("User not found!");
    }
}

// DELETE user
function deleteData() {
    const userId = document.getElementById("id").value.trim();

    if (!userId) {
        alert("Please enter user ID to delete!");
        return;
    }

    localUsers = localUsers.filter(user => user.id != userId);
    displayData(localUsers);
    alert("User Deleted Successfully!");
}

// Attach event listeners to buttons
document.addEventListener("DOMContentLoaded", () => {
    fetchInitialData();
    document.querySelector(".get").addEventListener("click", getData);
    document.querySelector(".post").addEventListener("click", postData);
    document.querySelector(".put").addEventListener("click", putData);
    document.querySelector(".patch").addEventListener("click", patchData);
    document.querySelector(".delete").addEventListener("click", deleteData);
});