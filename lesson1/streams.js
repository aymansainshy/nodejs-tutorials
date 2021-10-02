const fs = require('fs');

const readStream = fs.createReadStream('./docs/docs3.txt'); 

const whritStream = fs.createWriteStream('./docs/docs4.txt');

var count = 0;

readStream.on('data', (chunkOfData) => {
   console.log('------ New chunk of Data ------');
   // console.log(count);
   // count ++;
   console.log(chunkOfData);
   whritStream.write("\n new chunk Whriten \n");
   whritStream.write(chunkOfData);
});

// Piping ..........
// Read from stream and write to anthor stream at the one time ..
readStream.pipe(whritStream);