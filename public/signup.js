const signupForm = document.getElementById("signup");
signupForm.addEventListener("submit", (event) => {
    //prevent form from refreshing the page
    event.preventDefault();
    const elements = event.target.elements;
    const email = elements.email.value;
    const password = elements.password.value;
    //check if email or password don't exists
    // if they don't stop running the code
    if(!email || !password){
        return;
    }
    const user = {
        email, 
        password
    }
    console.log(user);
    createUser(user);


})
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
async function createUser(user){
    const response = await fetch(`http://localhost:3000/signup`,{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
    });

    
    
    const jsonData = await response.json();
    if(jsonData._id){
        setCookie("userID",jsonData._id,1);
        window.location.href = "http://localhost:3000/"
    }
    console.log(jsonData);
}