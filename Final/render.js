export function layout(content) {
    return `<!DOCTYPE>
    <html lang="en-US">
    <head>
      <meta charset="UTF-8">
      <title>Let's Drink~</title>
      <style>
        body {
          padding: 80px;
          font: 16px Helvetica, Arial;
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