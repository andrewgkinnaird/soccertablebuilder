



const table = [];

const tableRows = [
    {
        tablePosition:1,
        team:'England',
        gamesPlayed:6,
        gamesWon:5,
        gamesDrawn:1,
        gamesLost:0,
        goalsFor:19,
        goalsAgainst:3,
        goalDifference:16,
        points:16
    },
    {
        tablePosition:2,
        team:'Ukraine',
        gamesPlayed:7,
        gamesWon:4,
        gamesDrawn:1,
        gamesLost:2,
        goalsFor:11,
        goalsAgainst:8,
        goalDifference:3,
        points:13
    },
    {
        tablePosition:3,
        team:'Italy',
        gamesPlayed:6,
        gamesWon:3,
        gamesDrawn:1,
        gamesLost:2,
        goalsFor:11,
        goalsAgainst:7,
        goalDifference:4,
        points:10
    },
    {
        tablePosition:4,
        team:'North Macedonia',
        gamesPlayed:6,
        gamesWon:2,
        gamesDrawn:1,
        gamesLost:3,
        goalsFor:7,
        goalsAgainst:14,
        goalDifference:-7,
        points:7
    },
    {
        tablePosition:5,
        team:'Malta',
        gamesPlayed:7,
        gamesWon:0,
        gamesDrawn:0,
        gamesLost:7,
        goalsFor:2,
        goalsAgainst:18,
        goalDifference:-16,
        points:0
    }
]

const getTable = () => {
    return table;
}

const initTable = () => {
    clearTable();

    tableRows.forEach((row) => {
        table.push(structuredClone(row));
    })
}

const clearTable = () => {
    while(table.length > 0){
        table.pop();
    }
}

const displayTable = () => {
    console.table(table);
}

const updateTable = (match) => {
    const homeTeam = table.findIndex((row) => row.team === match.homeTeam);
    const awayTeam = table.findIndex((row) => row.team === match.awayTeam);
    
    table[homeTeam].gamesPlayed += 1;
    table[awayTeam].gamesPlayed += 1;
    
    if(match.homeGoals > match.awayGoals){
        table[homeTeam].gamesWon += 1;
        table[awayTeam].gamesLost += 1;
        table[homeTeam].points += 3;
    }
    else if(match.awayGoals > match.homeGoals){
        table[awayTeam].gamesWon += 1;
        table[homeTeam].gamesLost += 1;
        table[awayTeam].points += 3;
    }
    else{
        table[homeTeam].gamesDrawn += 1;
        table[awayTeam].gamesDrawn += 1;
        table[homeTeam].points += 1;
        table[awayTeam].points += 1;
    }

    table[homeTeam].goalsFor += match.homeGoals;
    table[awayTeam].goalsFor += match.awayGoals;
    table[homeTeam].goalsAgainst += match.awayGoals;
    table[awayTeam].goalsAgainst += match.homeGoals;
    table[homeTeam].goalDifference = table[homeTeam].goalsFor - table[homeTeam].goalsAgainst;
    table[awayTeam].goalDifference = table[awayTeam].goalsFor - table[awayTeam].goalsAgainst;

    sortTable();
    displayTable();
}

const sortTable = () => {
    table.sort((a,b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
    table.forEach((row,index) => row.tablePosition = index + 1 );
} 

exports.initTable = initTable;
exports.getTable = getTable;
exports.displayTable = displayTable;
exports.updateTable = updateTable;