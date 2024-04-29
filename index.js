#!/usr/bin/env node
'use-strict'


const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

const numberGen = (min, max) => {
    const rndNum = Math.round(Math.random() * (max - min) + min);
    console.log(`A number in the range from ${min} to ${max} has been guessed`);
    return rndNum;
};

const godObj = {
    playStart: false,
    headsOrTailsNum: 0,
}
function getCounter() {
    let counter = 0;
    return function() {
      return counter++;
    }
}
let count = getCounter();
console.log(count());  // 0
console.log(count());  // 1
console.log(count());  // 2

// const initGame = () => {
//     godObj.headsOrTailsNum = numberGen(1, 2);
//     console.log(godObj)
// };

// while (!godObj.playStart) {
//     rl.question('Heads or tails? (1 or 2) ', (answer) => {
//         initGame();
//         if (!isNaN(answer) && Number(answer) > 0 && Number(answer) <= 2) {
//             godObj.playStart = true;
//         }
//         // TODO: Log the answer in a database
//         console.log(`Thank you for your valuable feedback: ${answer}`);
//     });
// }
// rl.on('line', (input) => {
//     console.log(`Received: ${input}`);
//   }); 