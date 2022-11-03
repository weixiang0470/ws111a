import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const app = new Application();
const router = new Router();
const db = new DB("SQL.db");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, comment TEXT)");
//db.query("INSERT INTO users (name , comment) VALUES ('aaa', 'aaaaa')");
let test = db.query("SELECT * FROM users");
console.log(test);

router.get('/', home)
  .get('/sql',sql)
  .get('/cmd/:sqlcmd',sqlcmd);

app.use(router.routes());
app.use(router.allowedMethods());

async function sqlcmd(ctx){
  const command = ctx.params['sqlcmd'];
  console.log("command : ",command);
  try{
    //db.query(command);
    let result = db.query(command);
    //let size = Object.keys(result).length;
    console.log("result : ",result);
    ctx.response.type = 'application/json';
    //let result1 = {0:"Successful!"};
    //if(size==0)ctx.response.body=result1;
    //else {ctx.response.body=result;}
    ctx.response.body=result;
  }
  catch{
    ctx.response.type = 'application/json';
    ctx.response.body="Error";
  }
}

async function sql(ctx){
  let database = db.query("SELECT * FROM users");
  ctx.response.type = 'application/json';
  ctx.response.body = database;
}

async function home(ctx) {
  ctx.response.redirect('/public/');
}

app.use(async (ctx, next) => {
    await next()
    console.log('path=', ctx.request.url.pathname)
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}`,
      index: "SQL.html",
    })
  })

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 })