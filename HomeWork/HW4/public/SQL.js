
R={};

window.onload = ShowSql();

async function submit(){
    const sqlcmd = document.getElementById("CommandArea").value;
    let result = await window.fetch(`/cmd/${sqlcmd}`);
    console.log("result : ",result);
    let result2 = await result.json();
    console.log("result2 : ",result2);
    let size = Object.keys(result2).length;
    console.log("Size : ",size);
    if(size <= 0)document.getElementById("ResultArea").innerHTML = "Successful!";
    else{document.getElementById("ResultArea").innerHTML = JSON.stringify(result2);}
    document.getElementById("CommandArea").value = "";
    ShowSql();
}
async function ShowSql(){
    let r = await window.fetch('/sql')
    database = await r.json()
    console.log(database);
    SqlShow(database);
}
//const Page = ``
/*window.onhashchange = async function(){
    var r;
    var tokens = window.location.hash.split('/');
    console.log("tokens : ",tokens);
    switch(tokens[0]){
        default:
            //r=await window.fetch('/sql');
            //let node = await r.json();
            r = await window.fetch('/sql')
            database = await r.json()
            console.log(database);
            SqlShow(database);
            //R.page();
            break;
    }
}*/

function SqlShow(database){
    var SQL_Table_Content = document.getElementById("SqlTable");
    var content = "";
    content += "<tr><th>Id</th><th>Name</th><th>Comment</th></tr>";
    for (let row of database){
        content += "<tr>";
        for(let col of row){
            content += `<td>${col}</td>`
        }
        content+="</tr>";
    }
    console.log(content);
    SQL_Table_Content.innerHTML=content;
}

/*
window.onload = async function(){
    R.page();
}
R.layout = function(content){
    document.getElementsByTagName("body")[0].innerHTML = content;
}
R.page = function(){
    return R.layout(Page);
}*/