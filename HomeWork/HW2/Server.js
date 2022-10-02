import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import * as render from "./Functions.js";

const db = new DB("calendar.db");
db.query("CREATE TABLE IF NOT EXISTS calendar(id INTEGER PRIMARY KEY AUTOINCREMENT, date DIM_DATE, title TEXT, work TEXT)");

const router = new Router();

router.post('/calendar', create)
  .get('/', list)
  .get('/calendar/new', add)
  .get('/calendar/:id', show)
  .get('/delete/:id', ddd);
  

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

/*function query(sql) {
  let list = []
  for (const [id,date, title, work] of db.query(sql)) {
    list.push({id, date,title, work})
  }
  return list
}*/
async function ddd(ctx){
  const pid = ctx.params.id;
  db.query(`DELETE FROM calendar WHERE id=${pid}`)
  list(ctx);
}
async function add(ctx) {
    ctx.response.body = await render.NewWork();
  }

async function create(ctx){
    const body = ctx.request.body()
    //console.log('body = ', body)
    if (body.type === "form") {
        const pairs = await body.value
        //console.log('pairs = ', pairs)
        const post = {}
        for (const [key, value] of pairs) {
          post[key] = value
          //console.log('key = ', key)
          //console.log('value = ', value)
          //console.log('post[key] = ', post[key])
        }
        console.log('create:post=', post)
        db.query("INSERT INTO calendar( date, title, work) VALUES (?,?,?)", [post.date,post.title, post.work]);
        //ctx.response.redirect('/');
        let sql_data = db.query("SELECT * from calendar");
        console.log("SQL : ", sql_data);
        ctx.response.redirect('/');
      }
}

async function list(ctx) {
  let calendars = db.query("SELECT * FROM calendar");
  console.log('list:posts = ', calendars);
  ctx.response.body = await render.list(calendars);
}

async function show(ctx) {
  const pid = ctx.params.id;
  let posts = db.query(`SELECT * FROM calendar WHERE id=${pid}`)
  console.log('show:posts=', posts)
  if (!posts) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(posts[0]);
}

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });