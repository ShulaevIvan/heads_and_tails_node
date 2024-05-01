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
    winner: undefined,
    lastPathName: undefined,
    round: 0,
    plusRound: (value) => plusRound(value),
    startGame: () => startGame(),
    createDir: () => createDir(globalGameObj.logDirName),
    createLogFile: (fileName) => createLogFile(fileName),
    generateNum: (min, max) => numberGen(min=1, max=2),
    checkWinner: () => checkWinner(),
};

function plusRound(value) {
    globalGameObj.round = Number(globalGameObj.round) + Number(value);
}

function createLogFile(fileName) {
    const fullPath = path.join(__dirname, `${globalGameObj.logDirName}`, `${fileName}.json`);
    if (fs.existsSync(fullPath)) {
        fs.readFile(fullPath, (err, data) => { 
            if (err) throw err;
            const jsonData = JSON.parse(data);
            const logObj = globalGameObj.checkWinner();
            const newData = [...jsonData, logObj];
            const writeStream = fs.createWriteStream(`${fullPath}`);
            writeStream.write(JSON.stringify(newData), 'UTF8');
            writeStream.end();
        }); 
        return fullPath;
    }
    globalGameObj.createDir();
    const writeStream = fs.createWriteStream(`${fullPath}`);
    const content = globalGameObj.checkWinner();
    const data = [];
    data.push(content);
    writeStream.write(JSON.stringify(data), 'UTF8');
    writeStream.end();

    return fullPath;
};

function startGame() {
    rl.question('Heads or tails? (1 or 2): ', (answer) => {
        if (!isNaN(answer) && Number(answer) > 0 && Number(answer) <= 2) {
            globalGameObj.playStart = true;
            globalGameObj.userValue = Number(answer);
            globalGameObj.headsOrTailsNum = globalGameObj.generateNum();
            rl.question('select the file name: ', (answer) => {
                const logPath = createLogFile(answer);
                globalGameObj.lastPathName = logPath;
                console.log(`log file created at ${logPath}`);
                console.log(`${globalGameObj.round} end, ${globalGameObj.winner} won!`);
                rl.question('play again ? 1 - yes, 2 - exit: ', (answer) => {
                    if (!isNaN(answer) && Number(answer) > 0 && Number(answer) <= 1) {
                        return globalGameObj.startGame();
                    }
                    return rl.close();
                })
            })
            return;
        }
        console.log('input err, the game is restart... ');
        return globalGameObj.startGame();
    });
};

function checkWinner() {
    const headOrTailsStringName = globalGameObj.headsOrTailsNum === 1 ? "Heads" : "Tails";
    const contentJson = {
        round: globalGameObj.round,
        generateValue: globalGameObj.headsOrTailsNum,
        generateName: globalGameObj.headsOrTailsNum === 1 ? "Heads" : "Tails",
        winner: globalGameObj.winner,
        text: `generate ${headOrTailsStringName} (You: ${globalGameObj.userValue} | Comp: ${globalGameObj.headsOrTailsNum})`,
    };

    return contentJson;
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
    globalGameObj.headsOrTailsNum = rndNum;
    globalGameObj.winner = globalGameObj.headsOrTailsNum === globalGameObj.userValue ? 'Player': 'Comp';
    globalGameObj.plusRound(1);
    return rndNum;
};

module.exports = globalGameObj;