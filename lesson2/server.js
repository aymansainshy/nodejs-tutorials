const http = require('http');
const fs = require('fs');
const _ = require('lodash')

// This is pure NodeJs code .....
//Setup Configrations & make it ready  ......
const server = http.createServer((req, res) => {
    console.log("Request made to Server ");
    // console.log(req.url, req.method);

    // Lodash ........
    const num = _.random(0, 30);
    console.log(num);

    const greet = _.once(() => {
        console.log("Hello Ayman Sainshy");
    });

    greet();
    greet();

    //Set Header Content Type ...
    res.setHeader('Content-type', 'text/html')

    // res.write("<h1> Hello Ayman sainshy  </h1>");
    // res.end();

    let path = './lesson2/views/';
    switch (req.url) {
        case '/':
            path += 'index.htm';
            res.statusCode = 200;
            break;
        case '/about':
            path += 'about.htm';
            res.statusCode = 200;
            break;
        case '/about-me':
            // This is for Redirect
            res.statusCode = 301;
            res.setHeader('Location', '/about');
            res.end();
            break;
        default:
            path += '404.htm';
            res.statusCode = 404;
            break;
    }

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
            res.end();
        }
        var htmlPage = data;
        res.write(htmlPage);
        res.end();
    });
    //    http.ServerResponse("<h1> Hi There ....</h1>");
});


// Our server now ready to listen on port 3000 , 127.0.0.1
server.listen(3000, 'localhost', () => {
    console.log("listing fot request on port 3000");
});