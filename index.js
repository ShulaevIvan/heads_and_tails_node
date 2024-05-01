#!/usr/bin/env node
'use-strict'

const gameObj = require('./gameFunctions');
const analyzer = require('./analyzer');
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
            .option('count', {
                alias: 'c',
                describe: 'total number of matches',
                type: 'boolean',
            })
            .option('stat', {
                alias: 's',
                describe: 'number of games won/lost',
                type: 'boolean',
            })
            .option('percent', {
                alias: 'p',
                describe: 'percentage of games won',
                type: 'boolean',
            })
        )
    },
    handler: (argv) => {
        const analyze = argv.a;
        if (analyze) {
            const testPath = '/home/adminpy/Desktop/heads_and_tails/log/test.json';
            analyzer(testPath);
            return;
        }
        gameObj.startGame();
    }
}).parse();