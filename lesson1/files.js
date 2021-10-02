const fs = require('fs');


fs.writeFile(file = 'docs/docs3.txt', data = 'This Text edited from ayman', () => {
    console.log('File was writen');
});

fs.readFile(path = './docs/docs1.txt', (err, data) => {
    if (err) {
        console.log(err);
    }
    console.log(data.toString());
});


// console.log("last line ....\n");
if (!fs.existsSync('./assets')) {
    fs.mkdir('./assets', (err) => {
        if (err) {
            console.log(err);
        }
        console.log("Folder created ..");
    });
} else {
    fs.rmdir('./assets', (err) => {
        if (err) {
            console.log('Error ..');
        }
        console.log("File deleted ");
    });
}


if(fs.existsSync('./docs/deleteme.txt')){
    fs.unlink('./docs/deleteme.txt', (err) => {
        if(err){
            console.log("Error ..");
        }
        console.log("File Deleted ....");
    });
}
