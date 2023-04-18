console.log("hello login");
//when someone clicks submit connect to backend "server.js"
const signupForm = document.getElementById("signup");
signupForm.addEventListener("submit", (event) => {
    //prevent form from refreshing the page
    event.preventDefault();
    const elements = event.target.elements;
    const email = elements.email.value;
    const password = elements.password.value;
    //check if email or password don't exists if they don't stop running the code
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
async function createUser(user){
    const response = await fetch(`http://localhost:3000/signup`,{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
    });
    
    const jsonData = await response.json();
    console.log(jsonData);
}