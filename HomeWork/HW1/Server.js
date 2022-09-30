import { page } from "./Page.js";
import { Application } from "https://deno.land/x/oak/mod.ts";

const App = new Application();

App.use((ctx)=>{
    let pathname = ctx.request.url.pathname;
    if(pathname.startsWith("/login")){
        ctx.response.body = page(`
            <form>
            <br>
            <p><input type="text" name="user" value="" placeholder="User name"></p>
            <p><input type="password" name="password" value="" placeholder="Password"></p>
            <p><input type="submit" value="test"></p>
            </form>
        `)
    }
    else {
        ctx.response.body = page(`
            <h1>Xiang~</h1>
            <hr>
            <p>Be patient!!! The page is on going~</p>
        `)
    }
});


console.log('start at : http://127.0.0.1:8000');
await App.listen({ port: 8000 });