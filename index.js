



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
    tableRows.forEach((row) => {
        table.push(row);
    })
    displayTable();
}

const displayTable = (table) => {
    console.log(table);
}

const updateTable = (match,tableIn) => {
    const homeTeam = table.findIndex((row) => row.team === match.homeTeam);
    const awayTeam = table.findIndex((row) => row.team === match.awayTeam);
    
    tableIn[homeTeam].gamesPlayed += 1;
    tableIn[awayTeam].gamesPlayed += 1;
    
    if(match.homeGoals > match.awayGoals){
        tableIn[homeTeam].gamesWon += 1;
        tableIn[awayTeam].gamesLost += 1;
        tableIn[homeTeam].points += 3;
    }
    else if(match.awayGoals > match.homeGoals){
        tableIn[awayTeam].gamesWon += 1;
        tableIn[homeTeam].gamesLost += 1;
        tableIn[awayTeam].points += 3;
    }
    else{
        tableIn[homeTeam].gamesDrawn += 1;
        tableIn[awayTeam].gamesDrawn += 1;
        tableIn[homeTeam].points += 1;
        tableIn[awayTeam].points += 1;
    }

    tableIn[homeTeam].goalsFor += match.homeGoals;
    tableIn[awayTeam].goalsFor += match.awayGoals;
    tableIn[homeTeam].goalsAgainst += match.awayGoals;
    tableIn[awayTeam].goalsAgainst += match.homeGoals;
    tableIn[homeTeam].goalDifference = tableIn[homeTeam].goalsFor - tableIn[homeTeam].goalsAgainst;
    tableIn[awayTeam].goalDifference = tableIn[awayTeam].goalsFor - tableIn[awayTeam].goalsAgainst;

    return tableIn;
}

exports.initTable = initTable;
exports.getTable = getTable;
exports.displayTable = displayTable;
exports.updateTable = updateTable;