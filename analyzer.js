'use strict';
const fs = require('fs');

const analyze = (logPath) => {
    if(fs.existsSync(logPath)) {
        const jsonLog = require(logPath);
        const allRounds = jsonLog.reduce((acc, item) => acc += 1, 0);
        const playerWin = jsonLog.filter((item) => item.winner === 'Player').length;
        const winComp = jsonLog.filter((item) => item.winner === 'Comp').length;
        const winPercent=  Number((playerWin / (playerWin + winComp) * 100).toFixed(2));
        const text = `stats:  All Rounds- ${allRounds},\n Player Win - ${playerWin},\n Comp Win - ${winComp},\n Player Win Percent - ${winPercent}%\n`;
        
        return text;
    }
    return `err filePath ${logPath} not exists`;
};

module.exports = analyze;