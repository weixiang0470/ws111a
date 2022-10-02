export function show(calendars){
    return layout2(
        `
        <h1>${calendars[2]}(${calendars[1]})</h1>
        <p>${calendars[3]}</p>
        <a href="/">Back</a>
        `
    )
}
export function list(calendars){
    let list=[];
    for(let i of calendars){
        list.push(
        `    
            <li>
            <h2>${i[2]}(${i[1]})</h2>
            <p>
                <a href="/calendar/${i[0]}">Read</a>
                <a href="/delete/${i[0]}">Delete</a>
            </p>
            </li>
        `
      )
      //console.log("i.title : ", i[2] );
      //console.log("i.date : ", i[1] );
      //console.log("i.id : ", i[0] );
    }
    let content = `
    <h1>Calendars</h1>
    <p>You have <strong>${calendars.length}</strong> works!</p>
    <p><a href="/calendar/new">Create a Post</a></p>
    <ul id="works">
      ${list.join('\n')}
      <br>
    </ul>
    `
    return layout2(content);
}

export function NewWork() {
    return layout( `
    <h1>New Work</h1>
    <form action="/calendar" method="post">
      <p><input type="date" name="date" required></p>
      <p><input type="text" placeholder="Title" name="title" required></p>
      <hr>
      <p><textarea placeholder="Contents" name="work" required></textarea></p>
      <p><input type="submit" value="Create"></p>
    </form>
    `)
  }

export function layout(body){
return `<!DOCTYPE>
<html lang="en-US">
    <head>    
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="UTF-8">
        <title>Xiang~</title>
        <style>
            body {
                text-align: center;
            }
            #CreateStyle {
                text-align: center;
                background-color: black;
                color:aliceblue;
                border-radius: 5px;
                border-color: bisque;
                border-style: dashed;
                width:40vw;
                position: relative;
                display: inline-block;
            }
            textarea {
                width: 30vw;
                height: 20vw;
            }
          
            input[type=text],
            textarea {
                padding: 10px;
                font-size: large;
            }
        
            input[type=text] {
                width: 30vw;
            }
        </style>
    </head>
    <body>
    <div id="CreateStyle">
        ${body}
    <div>
    </body>
</html>`
}
export function layout2(content) {
    return `<!DOCTYPE>
    <html>
    <head>
      <title>Xiang~</title>
      <style>
        body {
          padding: 80px;
          font: 16px Helvetica, Arial;
        }
    
        h1 {
          font-size: 2em;
        }
    
        h2 {
          font-size: 1.2em;
        }
    
        #posts {
          margin: 0;
          padding: 0;
        }
    
        #posts li {
          margin: 40px 0;
          padding: 0;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
          list-style: none;
        }
    
        #posts li:last-child {
          border-bottom: none;
        }
    
        textarea {
          width: 500px;
          height: 300px;
        }
    
        input[type=text],
        textarea {
          border: 1px solid #eee;
          border-top-color: #ddd;
          border-left-color: #ddd;
          border-radius: 2px;
          padding: 15px;
          font-size: .8em;
        }
    
        input[type=text] {
          width: 500px;
        }
      </style>
    </head>
    <body>
      <section id="content">
        ${content}
      </section>
    </body>
    </html>
    `
  }