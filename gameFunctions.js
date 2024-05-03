'use-strict'

const readline = require('node:readline');
const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('node:process');

class Game {
    constructor(logDir) {
        this.rl = readline.createInterface({ input, output });
        this.playStart = false;
        this.headsOrTailsNum = 0;
        this.userValue = undefined;
        this.userFileName = undefined;
        this.logDirName = logDir;
        this.winner = undefined;
        this.round = 0;
    };

    plusRound(value) {
        this.round = Number(this.round) + Number(value);
    };

    startGame() {
        this.rl.question('Heads or tails? (1 or 2): ', (answer) => {
            if (!isNaN(answer) && Number(answer) > 0 && Number(answer) <= 2) {
                this.playStart = true;
                this.userValue = Number(answer);
                this.headsOrTailsNum = this.numberGen();
                this.rl.question('select the file name: ', (answer) => {
                    const logPath = this.createLogFile(answer);
                    console.log(`log file created at ${logPath}`);
                    console.log(`round ${this.round} end, ${this.winner} won!`);
                    this.rl.question('play again ? 1 - yes, 2 - exit: ', (answer) => {
                        if (!isNaN(answer) && Number(answer) > 0 && Number(answer) <= 1) {
                            return this.startGame();
                        }
                        return this.rl.close();
                    })
                })
                return;
            }
            console.log('input err, the game is restart... ');
            return this.startGame();
        });
    }
    
    restartGame() {
        return this.rl.question('restart game ? 1 - yes 2 - exit : ', (ans) => {
            if (Number(ans) === 1) return this.startGame();
            return this.rl.close();
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
        this.createDir(this.logDirName);
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
        const folderPath = path.join(__dirname, `${dirName ? dirName : this.logDirName}`);
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
};

const game = new Game('log');

module.exports = game;