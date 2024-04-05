document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault(); 

    // Fetch input values
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;

    //validation here if needed

    //Sending the data to the server
    var userData = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    //send userData to your backend for processing
    console.log(userData);
});
