const range = 3000;
let steplength = 100;
const deltasteplength = 0.99;
let price = 1;
const deltaprice = 1.1;

let x=0;

for (n=0;n<range;n++){
    if (x>Math.floor(steplength)){
        x=0;
        steplength*=deltasteplength;
        price*=deltaprice
    }
    x++;
    console.log(`${n},${price}`)
}
