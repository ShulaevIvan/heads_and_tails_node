#!/usr/bin/env node
'use-strict'


const readline = require('node:readline');
const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });
const globalGameObj = {
    playStart: false,
    headsOrTailsNum: 0,
    userValue: undefined,
    userFileName: undefined,
    logDirName: 'log',
    createDir: () => createDir(globalGameObj.logDirName),
    generateNum: (min, max) => numberGen(min=1, max=2),
    checkWinner: () => checkWinner(),
};

const createLogFile = (fileName) => {
    const fullPath = path.join(__dirname, `${globalGameObj.logDirName}`, `${fileName}.txt`);
    const content = `${globalGameObj.checkWinner()}`;
    if (fs.existsSync(fullPath)) {
        fs.appendFile(fullPath, `${content} \n`, function (err) {
            if (err) throw err;
        });
        return;
    }
    globalGameObj.createDir();
    const writeStream = fs.createWriteStream(`${fullPath}`);
    writeStream.write(`${content} \n`, 'UTF8');
    writeStream.end();
};

const initGame = () => {
    rl.question('Heads or tails? (1 or 2): ', (answer) => {
        if (!isNaN(answer) && Number(answer) > 0 && Number(answer) <= 2) {
            globalGameObj.playStart = true;
            globalGameObj.userValue = answer;
            globalGameObj.headsOrTailsNum = globalGameObj.generateNum();
            rl.question('select the file name: ', (answer) => {
                createLogFile(answer);
            })
            return;
        }
        console.log('input err, the game is restart... ');
        return initGame();
    });
}
initGame();


function checkWinner(value) {
    const mainText = globalGameObj.headsOrTailsNum === 1 ? "heads" : "tails";
    const conent = `generate ${mainText} (You: ${globalGameObj.userValue} | GenNum: ${globalGameObj.headsOrTailsNum})`;
    return Number(globalGameObj.userValue) === globalGameObj.headsOrTailsNum ? 
        `Player win ${conent}` : `Player lose ${conent}`;
};

function createDir(dirName) {
    const folderPath = path.join(__dirname, `${dirName}`);
    if (!fs.existsSync(folderPath)) {
        fs.mkdir(path.join(__dirname, `${dirName}`),(err) => {
            if (err) {
                return console.error(err);
            }
        });
    }
};

function numberGen(min, max) {
    const rndNum = Math.round(Math.random() * (max - min) + min);
    return rndNum;
};