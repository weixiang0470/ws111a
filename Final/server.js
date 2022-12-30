import { Application, Router,send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";
import {
  viewEngine,
  oakAdapter,
  dejsEngine,
  //engineFactory,
  //adapterFactory,
} from "https://deno.land/x/view_engine@v10.6.0/mod.ts";

const db = new DB("main.db");
db.query("CREATE TABLE IF NOT EXISTS staff (name TEXT, password TEXT, level TEXT )");
db.query("CREATE TABLE IF NOT EXISTS products (name TEXT, price INTEGER)");
db.query("CREATE TABLE IF NOT EXISTS addon (name TEXT, price INTEGER)");
let test99 = db.query("SELECT * FROM staff");
if(test99.length==0){
    db.query("INSERT INTO staff (name, password, level) VALUES (?,?,?)", ["user1","user1","staff"]);
    db.query("INSERT INTO staff (name, password, level) VALUES (?,?,?)", ["user2","user2","staff"]);
    db.query("INSERT INTO staff (name, password, level) VALUES (?,?,?)", ["admin","admin","manager"]);
}
let test98 = db.query("SELECT * FROM products");
if(test98.length==0){
    db.query("INSERT INTO products (name, price) VALUES (?,?)", ["奶茶",30]);
    db.query("INSERT INTO products (name, price) VALUES (?,?)", ["拿鐵",40]);
    db.query("INSERT INTO products (name, price) VALUES (?,?)", ["咖啡",50]);
}
let test97 = db.query("SELECT * FROM addon");
if(test97.length==0){
    db.query("INSERT INTO addon (name, price) VALUES (?,?)", ["珍珠",10]);
    db.query("INSERT INTO addon (name, price) VALUES (?,?)", ["蘆薈",10]);
    db.query("INSERT INTO addon (name, price) VALUES (?,?)", ["椰果",10]);
}
const router=new Router();
router.get('/', home)
    .post('/login',login)
    .get('/who',who)
    .get('/logout',logout)
    .get('/edit',edit)
    .post('/changePro',changePro)
    .post('/changeAdd',changeAdd)
    .get('/homeproducts',homeproducts)
    .get('/save/:All',save);

const server = new Application;
server.use(viewEngine(oakAdapter, dejsEngine));
server.use(Session.initMiddleware())
server.use(router.routes());
server.use(router.allowedMethods());
server.use(async (ctx) => {
  //console.log('path=', ctx.request.url.pathname)
  await send(ctx, ctx.request.url.pathname, {
    // root: `${Deno.cwd()}/public/`,
    root: Deno.cwd(),
    index:"Home.html",
  });
});

async function home(ctx) {
    //ctx.response.redirect('/Home/');
    /*for (let i of AllDrink2){console.log(i);}
    for (let i of AllAdd2){console.log(i);}*/
    ctx.render("EJS/home.ejs");
}
const AllUser = db.query("SELECT * FROM staff");
async function login(ctx) {
    const body = ctx.request.body();
    const value = await body.value;
    //console.log("\nValue :\n",value);
    const user={};
    for( const[uname,psw] of value){
        user[uname]=psw;
        //console.log("user = ",user);
    }
    //console.log("AllUser :\n")
    let who = "guest";
    for( const[name,password,level] of AllUser){
        //console.log(name,password,level);
        //ErrorMSG="Wrong username or password!";
        if(user.uname==name && user.psw==password){
            who = level;
           //ErrorMSG="";
            break;
        }
    }
    //console.log("who = ",who);
    await ctx.state.session.set('who',who);
    if(who == 'guest'){
        ctx.response.type = 'text/html'
        ctx.response.body = '<div style="position:absolute;right:46%;top:30%;text-align:center;"><h1>Login Fail!</h1><a href="/">Go Back</a><div>';
    }
    else{ 
    //console.log('session.who=', await ctx.state.session.get('who'));
        ctx.response.redirect('/');
    }
}
db.query("CREATE TABLE IF NOT EXISTS statistic_product (name TEXT)");
db.query("CREATE TABLE IF NOT EXISTS statistic_addon (name TEXT)");
db.query("CREATE TABLE IF NOT EXISTS statistic_money (money INTEGER)");
let test96 = db.query("SELECT * FROM statistic_product");
let test95 = db.query("SELECT * FROM statistic_addon");
let test94 = db.query("SELECT * FROM statistic_money");
console.log(test96);
console.log(test95);
console.log(test94);
async function save(ctx){
    const data = ctx.params['All'];
    let data2 = data.split(",");
    console.log('data',data2);
    if(data2[0]==""){
        ctx.response.type = 'application/json';
        ctx.response.body="OK";
    }
    else{
    //console.log('data2',data2.length);
    let product_count = data2.length/3;
    console.log('count : ',product_count);
    for(let i =0;i<product_count;i++){
        let j = i*3;
        console.log(`j : ${data2[j]} j+1 : ${data2[j+1]} j+2 : ${data2[j+2]}`);
        db.query("INSERT INTO statistic_product (name) VALUES (?)", [data2[j]]);
        db.query("INSERT INTO statistic_addon (name) VALUES (?)", [data2[j+1]]);
        db.query("INSERT INTO statistic_money (money) VALUES (?)", [parseInt(data2[j+2])]);
    }
    ctx.response.type = 'application/json';
    ctx.response.body="OK";
    let test96 = db.query("SELECT * FROM statistic_product");
    let test95 = db.query("SELECT * FROM statistic_addon");
    let test94 = db.query("SELECT * FROM statistic_money");
    console.log(test96);
    console.log(test95);
    console.log(test94);
    }
}
async function who(ctx){
    if(await ctx.state.session.get('who')==null)await ctx.state.session.set('who','guest');
    let who = await ctx.state.session.get('who');
    //console.log('type = ',typeof(who));
    //console.log('Server.who = ',who);
    const GSM={};
    GSM['identity']=who;
    //console.log('GSM = ',GSM);
    ctx.response.type = 'application/json';
    ctx.response.body = GSM;
}
async function homeproducts(ctx){
    let AllDrink=db.query("SELECT * FROM products");
    let AllAdd = db.query("SELECT * FROM addon");
    let AllDrink2 = change(AllDrink);
    let AllAdd2 = change(AllAdd);
    const pro = {}
    pro['Drink']=AllDrink2;
    pro['Add']=AllAdd2;
    ctx.response.type = 'application/json';
    ctx.response.body = pro;
}
async function logout(ctx){
    await ctx.state.session.set('who','guest');
    //console.log(await ctx.state.session.get('who'));
}
function change(obj){
    let list=[];
    for(const[name,price] of obj){
        list.push({name,price});
    }
    return list;
}
async function edit(ctx){
    let who = await ctx.state.session.get('who');

    if(who!='manager'){
        ctx.response.redirect('/');
    }
    else{
        let Prots = db.query('SELECT * FROM products');
        let AddOn = db.query('SELECT * FROM addon');
        let Prots2 = change(Prots);
        let AddOn2 = change(AddOn);
        //console.log("Products2 : ",Prots2);
        //console.log("Add_On : ", AddOn);
        ctx.render("EJS/manager.ejs",{Prots2,AddOn2});
    }
}
async function changePro(ctx){
    const body = ctx.request.body();
    const value = await body.value;
    //console.log("body \n: ",body.type);
    //console.log("value : \n",value);
    const contents = {}
    for( const [C,I] of value){
      contents[C]=I;
    }
    //console.log("content : \n",contents.content);
    let test = contents.content;
    test = test.replace(/\s/g, '');
    test = test.split(";");
    const list = [];
    for( let i of test){
        list.push(i.split(":"));
    }
    //console.log("1");
    db.query("DELETE FROM products");
    //console.log("2");
    db.query("CREATE TABLE IF NOT EXISTS products (name TEXT, price INTEGER)");
    //console.log("3");
    for(let row of list){
        if(row=="")break;
        let data = [];
        for(let col of row){
            data.push(col);
        }
        db.query("INSERT INTO products (name, price) VALUES (?,?)", [data[0],parseInt(data[1])]);
    }
    let test2 = db.query("SELECT * FROM products");
    console.log(test2);
    edit(ctx);
}
async function changeAdd(ctx){
    const body = ctx.request.body();
    const value = await body.value;
    //console.log("body \n: ",body.type);
    //console.log("value : \n",value);
    const contents = {}
    for( const [C,I] of value){
      contents[C]=I;
    }
    //console.log("content : \n",contents.content);
    let test = contents.content;
    test = test.replace(/\s/g, '');
    test = test.split(";");
    const list = [];
    for( let i of test){
        list.push(i.split(":"));
    }
    //console.log("1");
    db.query("DELETE FROM addon");
    //console.log("2");
    db.query("CREATE TABLE IF NOT EXISTS addon (name TEXT, price INTEGER)");
    //console.log("3");
    for(let row of list){
        if(row=="")break;
        let data = [];
        for(let col of row){
            data.push(col);
        }
        db.query("INSERT INTO addon (name, price) VALUES (?,?)", [data[0],parseInt(data[1])]);
    }
    let test2 = db.query("SELECT * FROM addon");
    console.log(test2);
    edit(ctx);
}
console.log("Server start at : http://127.0.0.1:8000");
await server.listen({port:8000});