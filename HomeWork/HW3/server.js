import { Application, Router,send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import {
  viewEngine,
  oakAdapter,
  dejsEngine,
  //engineFactory,
  //adapterFactory,
} from "https://deno.land/x/view_engine@v10.6.0/mod.ts";

const db = new DB("Blog.db");
db.query("CREATE TABLE IF NOT EXISTS blogs(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)");
//"DROP TABLE blogs"
/*let count = db.query("SELECT id from blogs");
for(let x of count){
    db.query("DELETE id, title, content from blogs where id = VALUES(?)",[`${x}`]);
}*/
//db.query()
const router=new Router();
router.get('/',list)
  .get('/new',createpage)
  .post('/create',addpost)
  .get('/post/:id',show)
  .get('/del/:id',del)
  .get('/renew',renew);
  //.get('/public/',pub);
  //.get('/post/create')
//const ejsEngine = engineFactory.getEjsEngine();
//const oakAdapter = adapterFactory.getOakAdapter();
const server = new Application;
server.use(viewEngine(oakAdapter, dejsEngine));
server.use(router.routes());
server.use(router.allowedMethods());
server.use(async (ctx) => {
  console.log('path=', ctx.request.url.pathname)
  await send(ctx, ctx.request.url.pathname, {
    // root: `${Deno.cwd()}/public/`,
    root: Deno.cwd(),
    index: "index.html",
  });
});

db.query("INSERT INTO blogs (title, content) VALUES (?, ?)", ["aaa","aaaaa"]);
//db.query("INSERT INTO blogs (title, content) VALUES (?, ?)", ["bbb","bbbbb"]);
const header = `<!DOCTYPE html><html lang="en-US"><head>
<title>Xiang~Blog</title>
<link rel="stylesheet" type="text/css" href="../main.css">
</head>
<body><section id="blogcontent">`;
const footer =`</section></body></html>`; 

async function list(ctx){
  let posts = db.query("SELECT * FROM blogs");
  console.log("I\'m in list");
  await ctx.render("public/list.ejs",{header,posts,footer});
  //ctx.render("public/list.ejs",{posts});
  //ctx.render("public/list.ejs",{footer});
}

/*async function pub(ctx) {
  console.log('path=', ctx.request.url.pathname)
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}`,
    index: "",
  })
}*/

function show(ctx){
  try{
    const pid = ctx.params.id;
    console.log("I\'m in show");
    console.log("pid1 : "+pid);
    let post = db.query(`SELECT title, content FROM blogs WHERE id=${pid}`);
    console.log(post);
    ctx.render("public/show.ejs",{header,post,footer});
  }
  catch{
    console.log("Show error");
  }

}
async function del(ctx){
  const pid = ctx.params.id;
  db.query(`DELETE FROM blogs WHERE id=${pid}`);
  list(ctx);
}
async function createpage(ctx){
  console.log("I\'m in create page !!");
  ctx.render("public/createpage.ejs",{header,footer});
}
async function addpost(ctx){
  const body = ctx.request.body();
  //console.log("Body : ",body);
  console.log("I\'m in addpost");
  try{
    if (body.type === "form"){
      const value = await body.value;
      console.log("Value : ",value);
      const post = {}
      for( const [title,content] of value){
        console.log("T",title);
        console.log("C",content);
        post[title]=content;
      }
      console.log("post : ",post.title);
      db.query(`INSERT INTO blogs (title,content) VALUES (?,?)`,[post.title,post.content]);
      list(ctx);
    }
  }
  catch{
    console.log("addpost Error");
  }

}
async function renew(ctx){
  await db.query("DROP TABLE blogs");
  db.query("CREATE TABLE IF NOT EXISTS blogs(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)");
  ctx.response.redirect('/');
}
//let testing = db.query("SELECT id, title, content from blogs");
//console.log("DB : ",testing);
console.log("Server start at : http://127.0.0.1:8000");
await server.listen({port:8000});