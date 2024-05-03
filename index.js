#!/usr/bin/env node
'use-strict'

const gameObj = require('./gameFunctions');
const analyzer = require('./analyzer');
const fs = require('fs');
const path = require('path')
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
.command({
    command: 'start',
    describe: 'starting game',
    builder: (yargs) => {
        return (yargs
            .option('analyze', {
                alias: 'a',
                describe: 'default analyzer',
                type: 'boolean',
            })
        )
    },
    handler: (argv) => {
        const analyze = argv.a;
        if (analyze) {
            gameObj.rl.question('manual input - 1, automatic search - 2 : ', (ans) => {
                let dir = 'log';
                if (!fs.existsSync(`${__dirname}/${dir}`)) {
                    console.log('err, directory log not found...');
                    gameObj.rl.close();
                    return;
                }
                if (Number(ans) === 2) {
                    const files = fs.readdirSync(dir);
                    if (files.length > 0) {
                        files.forEach((item) => {
                            const filePath = path.join(__dirname, `${dir}`, `${item}`);
                            const result =  analyzer(filePath);
                            console.log(`\n file name: ${item}\n \n ${result} \n`);
                        });
                    };
                    gameObj.rl.close();
                    return;
                }
                else if (Number(ans) === 1) {
                    gameObj.rl.question('select log log directory : ', (directory) => {
                        if (!fs.existsSync(`${__dirname}/${directory}`)) {
                            console.log('err, directory not found...');
                            gameObj.rl.close();
                            return;
                        }
                        dir = directory;
                        gameObj.rl.question('select file name : ', (fileName) => {
                            const filePath = path.join(__dirname, `${dir}`, `${fileName}.json`);
                            if (fs.existsSync(filePath)) {
                                const result =  analyzer(filePath);
                                console.log(result);
                                return gameObj.restartGame();
                            }
                            console.log('err read file');
                            gameObj.rl.close();
                            return;
                        });
                    });
                    return;
                }
                return console.log('input err');
            });
        }
        gameObj.startGame();
    }
}).parse();