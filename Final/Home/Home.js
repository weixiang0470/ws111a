// Get the modal
var modal = document.getElementById('id01');
var ID = document.getElementById('whoID'); 
var MLink = document.getElementById('ManagerLink');
var Slink = document.getElementById('Statistic');
var DrkId = document.getElementById('Drink_div');
var AonId = document.getElementById('AddOn_div');
var cart = document.getElementById('orderlist');
var ID_Main = "";
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
    /*if(who2.identity == "manager" || who2.identity == "staff"){
        alert(`Login Successful, you're ${who2.identity}!`);
    }*/
    ID.src=`../Images/${who2.identity}.png`;
    ID_Main=who2.identity;
    if(who2.identity!='guest')logio.innerHTML='Logout';
    if(who2.identity=="manager"){MLink.style.display='block';Slink.style.display='block';}
    let pro = await window.fetch('homeproducts');
    let pro2 = await pro.json();
    //console.log(pro2);
    let Drink = pro2['Drink'];
    let Add = pro2['Add'];
    //console.log(Drink);
    //console.log(Add);//DrkId//AonId
    Drink_div='';
    AddOn_div='';
    for(let i of Drink){
        Drink_div+=`<input type="radio" name="drink" value="${i.name}:${i.price}">${i.name}:${i.price}</input><br>`;
    }
    for(let i of Add){
        AddOn_div+=`<input type="radio" name="addon" value="${i.name}:${i.price}">${i.name}:${i.price}</input><br>`;
    }
    AddOn_div+=`<input type="radio" name="addon" value="無:0">不加<br>`;
    DrkId.innerHTML = Drink_div;
    AonId.innerHTML = AddOn_div;
    await window.fetch('/');
    var test = localStorage.getItem("product").split(",");
    var products = "";
    for(i of test){
        products +=`${i}<br>`;
    }
    //console.log(products);
    cart.innerHTML=products;
}

async function send(){
    //const sqlcmd = document.getElementById("CommandArea").value;
    //let result = await window.fetch(`/cmd/${sqlcmd}`);
    if(localStorage.getItem("product")==""){
        alert("Empty");
    }
    else{
        var products = localStorage.getItem("product").split(",");
        //var drink=[];//var addon=[];//var money=[];
        if(products[0]==""){products.shift();}
        console.log('products=',products);
        const All=[];
        for(const i of products){
            let i2 = i.split(";");
            All.push(i2[0]);
            All.push(i2[1]);
            All.push(i2[4]);
        }
        
        //All.push(drink);
        //All.push(addon);
        //All.push(money);
        //console.log(All);
        let result = await window.fetch(`/save/${All}`);
        console.log(result);
        localStorage.setItem("product","");
        alert('sent');
        WHO();
    }
}

async function add(){
    try{
        if(ID_Main=="guest"){alert("Er...Login first!!!");}
        else{
            let data1 =document.querySelector('input[name="drink"]:checked').value;
            let data2 =document.querySelector('input[name="addon"]:checked').value;
            let data3 =document.querySelector('input[name="sugar"]:checked').value;
            let data4 =document.querySelector('input[name="ice"]:checked').value;
            //alert('data1 : '+data1 +'\ndata2 : '+data2+'\ndata3 : '+data3 +'\ndata4 : '+data4);
            data1 = data1.split(':');
            data2 = data2.split(':');
            let price1 = data1[1];
            let Drk_name = data1[0];//alert(price1);
            let price2 = data2[1];
            let Add_name = data2[0];
            let total = parseInt(price1) + parseInt(price2);
            //alert(total);
            const Order = `${Drk_name};${Add_name};${data3};${data4};${total}`;//alert(JSON.stringify(Order));
            var CartItems = [];
            if (localStorage.getItem("product") == null) localStorage.setItem("product", "");
            CartItems = localStorage.getItem("product",Order).split(',');
            CartItems.push(Order);
            localStorage.setItem("product",CartItems);
        }
    }
    catch{
        alert('你少選什麼了嗎...');
    }

}