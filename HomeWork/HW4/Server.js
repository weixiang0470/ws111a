import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const app = new Application();
const router = new Router();
const db = new DB("SQL.db");

router.get('/', home);

app.use(router.routes());
app.use(router.allowedMethods());

async function home(ctx) {
  ctx.response.redirect('/public/')
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