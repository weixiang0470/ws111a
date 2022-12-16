// Get the modal
var modal = document.getElementById('id01');
var ID = document.getElementById('whoID'); 
//window.onload = WHO();
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var logio = document.getElementById("LoginIcon");
async function ShowLogin(){
    if (logio.innerHTML=="Login")modal.style.display='block';
    else {
        await window.fetch('/logout');
        logio.innerHTML="Login";
        window.location.reload();
    }
}

/*async function login(){
    let who = await window.fetch('/login');
    console.log("who = ",who);
    let test = await who.json();
    console.log("test",test);
}*/
async function WHO(){
    let who = await window.fetch('/who');
    let who2 = await who.json();
    console.log(who2.identity);
    if(who2.identity == "manager" || who2.identity == "staff"){
        alert(`Login Successful, you're ${who2.identity}!`);
    }
    ID.src=`../Images/${who2.identity}.png`;
    if(who2.identity!='guest')logio.innerHTML='Logout';
    await window.fetch('/');
}