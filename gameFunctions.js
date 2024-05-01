'use-strict'

const readline = require('node:readline');
const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

class Game {
    constructor() {
        this.playStart = false;
        this.headsOrTailsNum = 0;
        this.userValue = undefined;
        this.userFileName = undefined;
        this.logDirName = 'log';
        this.winner = undefined;
        this.lastPathName = undefined;
        this.round = 0;
    };

    plusRound(value) {
        this.round = Number(this.round) + Number(value);
    }

    startGame() {
        rl.question('Heads or tails? (1 or 2): ', (answer) => {
            if (!isNaN(answer) && Number(answer) > 0 && Number(answer) <= 2) {
                this.playStart = true;
                this.userValue = Number(answer);
                this.headsOrTailsNum = this.numberGen();
                rl.question('select the file name: ', (answer) => {
                    const logPath = this.createLogFile(answer);
                    this.lastPathName = logPath;
                    console.log(`log file created at ${logPath}`);
                    console.log(`${this.round} end, ${this.winner} won!`);
                    rl.question('play again ? 1 - yes, 2 - exit: ', (answer) => {
                        if (!isNaN(answer) && Number(answer) > 0 && Number(answer) <= 1) {
                            return this.startGame();
                        }
                        return rl.close();
                    })
                })
                return;
            }
            console.log('input err, the game is restart... ');
            return this.startGame();
        });
    }

    createLogFile(fileName) {
        const fullPath = path.join(__dirname, `${this.logDirName}`, `${fileName}.json`);
        if (fs.existsSync(fullPath)) {
            fs.readFile(fullPath, (err, data) => { 
                if (err) throw err;
                const jsonData = JSON.parse(data);
                const logObj = this.checkWinner();
                const newData = [...jsonData, logObj];
                const writeStream = fs.createWriteStream(`${fullPath}`);
                writeStream.write(JSON.stringify(newData), 'UTF8');
                writeStream.end();
            }); 
            return fullPath;
        }
        this.createDir();
        const writeStream = fs.createWriteStream(`${fullPath}`);
        const content = this.checkWinner();
        const data = [];
        data.push(content);
        writeStream.write(JSON.stringify(data), 'UTF8');
        writeStream.end();

        return fullPath;
    }

    checkWinner() {
        const headOrTailsStringName = this.headsOrTailsNum === 1 ? "Heads" : "Tails";
        console.log(this.headsOrTailsNum)
        const contentJson = {
            round: this.round,
            generateValue: this.headsOrTailsNum,
            generateName: this.headsOrTailsNum === 1 ? "Heads" : "Tails",
            winner: this.winner,
            text: `generate ${headOrTailsStringName} (You: ${this.userValue} | Comp: ${this.headsOrTailsNum})`,
        };
    
        return contentJson;
    }

    createDir(dirName) {
        const folderPath = path.join(__dirname, `${dirName}`);
        if (!fs.existsSync(folderPath)) {
            fs.mkdir(path.join(__dirname, `${dirName}`),(err) => {
                if (err) {
                    return console.error(err);
                }
            });
        }
    }

    numberGen(min=1, max=2) {
        const rndNum = Math.round(Math.random() * (max - min) + min);
        this.headsOrTailsNum = rndNum;
        this.winner = this.headsOrTailsNum === this.userValue ? 'Player': 'Comp';
        this.plusRound(1);

        return rndNum;
    }
}

const game = new Game();

module.exports = game;