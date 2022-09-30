export function page(body){
    return `
    <!DOCTYPE html>
    <html lang="en-US">
    <head>
     <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <style>
        body {
            text-align: center;
            background-color: black;
            color:aliceblue;
            padding: 10vw;
        }
    </style>
    <body>
    ${body}
    </body>
    </html>
    `
}

// <link rel="stylesheet" type="text/css" href="Page.css">
// <link rel="stylesheet" type="text/css" href="Homepage.css">