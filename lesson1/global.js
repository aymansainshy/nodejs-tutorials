// console.log(globalThis);
// 

globalThis.setTimeout(()=> {
    console.log("Stop interval ...");
    clearInterval(interaval);
}, 5000);


var numb = 1;

const interaval = setInterval(() => {
    console.log(`this is interval ${numb}`);
    numb ++;
}, 1000);


// console.log(__dirname);
// console.log(__filename);