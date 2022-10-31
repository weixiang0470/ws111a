
R={};

function submit(){
    window.location.hash="Execute";
}
const Page = `
<h1 id="tl">Xiang_SQL_Manager</h1><hr>
<h2>Command</h2>
<p><textarea id="CommandArea" placeholder="SQL command"></textarea></p>
<p><button type="submit" onclick="submit()">Execute</button></p>
<h2>SQL</h2>
<div id="ResultArea"></div>
<div id="SQLForm">
<h2>SQL_Form</h2>
<div id="SQLArea"></div>
</div>

`
window.onhashchange = async function(){
    var r;
    var tokens = window.location.hash.split('/');
    console.log("tokens : ",tokens);
    switch(tokens[0]){
        default:
            //r=await window.fetch('/sql');
            //let node = await r.json();
            R.page();
            break;
    }
}
window.onload = async function(){
    R.page();
}
R.layout = function(content){
    document.getElementsByTagName("body")[0].innerHTML = content;
}
R.page = function(){
    return R.layout(Page);
}