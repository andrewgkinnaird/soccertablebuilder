


class Table {
    playedMatches = [];
    matches = [];
    futureMatches = [];
    sortRules = [];
    tableRows = [];
    tableRowTemplate = {
        team:'',
        gamesPlayed:0,
        gamesWon:0,
        gamesDrawn:0,
        gamesLost:0,
        goalsFor:0,
        goalsAgainst:0,
        goalDifference:0,
        points:0
    }

    teams = [];

    constructor(teams,matches,futureMatches){
        this.teams = teams;
        this.matches = matches;
        this.futureMatches = futureMatches;
    }

    getTable(){
        return this;
    }

    clearTable(){
        this.playedMatches = [];
        if(!this.tableRows)
            return;

        while(this.tableRows.length > 0){
            this.tableRows.pop();
        }
        
    }

    initTable(){
        this.clearTable();
        
        this.teams.forEach((team) => {
            const newRow = structuredClone(this.tableRowTemplate);
            newRow.team = team;
            this.tableRows.push(newRow);
        })

        this.matches.forEach((match) => {
            this.updateTable(match);
        })
    }

    sort(){
        let sortedIndices = [];
        let sortedTable = [];

        this.tableRows.sort((a,b) => b.points - a.points); 
        
        let tiedIndices = this.findTeamsTied();

        tiedIndices.forEach((tie) => {
            if(tie.length === 1)
                    sortedIndices = sortedIndices.concat(tie);
            else
                    sortedIndices = sortedIndices.concat(this.handleH2H(tie)); //there's an infinite loop here
        });

        sortedIndices.forEach((index) => {
            sortedTable.push(this.tableRows[index]);
        })

        this.tableRows = sortedTable;
        
        
    }

    sortWithoutH2H = () => {
        return this.tableRows.sort((a,b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor)
    }

    

    updateTable = (match) => {
        const homeTeam = this.tableRows.findIndex((row) => row.team === match.homeTeam);
        const awayTeam = this.tableRows.findIndex((row) => row.team === match.awayTeam);
        
        this.tableRows[homeTeam].gamesPlayed += 1;
        this.tableRows[awayTeam].gamesPlayed += 1;
        
        if(match.homeGoals > match.awayGoals){
            this.tableRows[homeTeam].gamesWon += 1;
            this.tableRows[awayTeam].gamesLost += 1;
            this.tableRows[homeTeam].points += 3;
        }
        else if(match.awayGoals > match.homeGoals){
            this.tableRows[awayTeam].gamesWon += 1;
            this.tableRows[homeTeam].gamesLost += 1;
            this.tableRows[awayTeam].points += 3;
        }
        else{
            this.tableRows[homeTeam].gamesDrawn += 1;
            this.tableRows[awayTeam].gamesDrawn += 1;
            this.tableRows[homeTeam].points += 1;
            this.tableRows[awayTeam].points += 1;
        }
    
        this.tableRows[homeTeam].goalsFor += match.homeGoals;
        this.tableRows[awayTeam].goalsFor += match.awayGoals;
        this.tableRows[homeTeam].goalsAgainst += match.awayGoals;
        this.tableRows[awayTeam].goalsAgainst += match.homeGoals;
        this.tableRows[homeTeam].goalDifference = this.tableRows[homeTeam].goalsFor - this.tableRows[homeTeam].goalsAgainst;
        this.tableRows[awayTeam].goalDifference = this.tableRows[awayTeam].goalsFor - this.tableRows[awayTeam].goalsAgainst;
    
        this.playedMatches.push(match);
        
    }

    findTeamsTied = (tieBreakers=['points']) => {
        let ties = [];
        let temp = [0];
        
        const isTied = (i) => {
            let rowA = this.tableRows[i];
            let rowB = this.tableRows[i-1];

            for(let j=0; j<tieBreakers.length;j++){
                if(!(rowA[tieBreakers[j]] === rowB[tieBreakers[j]])){
                    return false;
                }
            }
            return true;
        }

        for(let i=1; i<this.tableRows.length; i++){
            
            while(i < this.tableRows.length && isTied(i)){
                temp.push(i);
                i++;
            }
            
            
            ties.push(temp);
            temp = [i];
            
            if(!temp.includes[i] && i === this.tableRows.length-1)
                ties.push([i])
        }
    
        if(ties.length > 0)
            return ties;
        else
            return [];
    }

    

    handleH2H = (indices) => {
        
        const subGroupTeams = indices.map((index) => this.tableRows[index].team);
        const subGroupMatches = this.playedMatches.filter((match) => subGroupTeams.includes(match.homeTeam) && subGroupTeams.includes(match.awayTeam));
        if(subGroupMatches.length === 0)
            return indices;
       
        const subGroup = new Table(subGroupTeams,subGroupMatches);
        
        subGroup.initTable();
        subGroup.sortWithoutH2H();
        

        let subGroupSortedIndices = [];
        let teamsTiedAfterH2H = [];

        subGroup.tableRows.forEach((row) => {
            subGroupSortedIndices.push(indices[subGroupTeams.findIndex((team) => row.team === team)]);
        } )
        
        teamsTiedAfterH2H = subGroup.findTeamsTied(['points','goalDifference','goalsFor']);

        if(teamsTiedAfterH2H.length === subGroupSortedIndices.length)
            return subGroupSortedIndices;
        else 
            return subGroupSortedIndices.sort((a,b) => this.tableRows[b].goalDifference - this.tableRows[a].goalDifference || this.tableRows[b].goalsFor - this.tableRows[a].goalsFor);
    }



    displayTable = () => {
        console.table(this.tableRows);
    }

    setMatches(matches){
        this.matches = matches;
    }

    getTablePosition(team){
        const index = this.tableRows.findIndex((row) => row.team === team );
        return  index + 1;
    }

    simulateMatch(match){
        if(!match.homeChance)
            return this.simulatePoissonMatch(match);

        const wheelSpin = Math.random();
        let homeGoals,awayGoals;

        if(wheelSpin < match.homeChance) // home team wins
        {
            homeGoals = Math.floor(4 * Math.random());
            awayGoals = Math.floor(homeGoals * Math.random());
        }
        else if(wheelSpin < match.homeChance + match.drawChance){ // draw
            homeGoals = Math.floor(4 * Math.random());
            awayGoals = homeGoals;
        }
        else{ // away team wins
            
            awayGoals = Math.floor(4 * Math.random());
            homeGoals = Math.floor(awayGoals * Math.random());
        }
       
        match.homeGoals = homeGoals;
        match.awayGoals = awayGoals;
        return match;
    }

    simulatePoissonMatch(match){
        const homeGoalsFor = this.tableRows.find((row) => row.team === match.homeTeam).goalsFor;
        const homeGoalsAgainst = this.tableRows.find((row) => row.team === match.homeTeam).goalsAgainst;
        const awayGoalsFor = this.tableRows.find((row) => row.team === match.awayTeam).goalsFor;
        const awayGoalsAgainst = this.tableRows.find((row) => row.team === match.awayTeam).goalsAgainst;
        const homeGamesPlayed = this.tableRows.find((row) => row.team === match.homeTeam).gamesPlayed;
        const awayGamesPlayed = this.tableRows.find((row) => row.team === match.awayTeam).gamesPlayed;

        const homeLambda = (homeGoalsFor + awayGoalsAgainst) / (homeGamesPlayed + awayGamesPlayed);
        const awayLambda = (awayGoalsFor + homeGoalsAgainst) / (homeGamesPlayed + awayGamesPlayed);
        const homeGoals = this.generatePoisson(homeLambda);
        const awayGoals = this.generatePoisson(awayLambda);

        match.homeGoals = homeGoals;
        match.awayGoals = awayGoals;

        return match;


    }

    generatePoisson = (lambda) => {
        const L = Math.exp(-lambda);
        let k = 0;
        let p = 1;
      
        do {
          k++;
          p *= Math.random();
        } while (p > L);
      
        return k - 1;
    }

    simulateTable(runs,positions = [1]){
        const winners = new Map();

        for(let i=0; i<runs; i++){
            this.initTable();
            this.futureMatches.forEach((match) => {
                const result = this.simulateMatch(match);
                this.updateTable(result);
                //this.sortWithoutH2H();
            });

            this.sort();

            positions.forEach((position) => {
                const team = this.tableRows[position-1].team;
                winners.set(team, (winners.get(team) || 0) + 1); 
            })
            
            
        }
        let result = [];

        for(const [key,value] of winners){
            const percentageChance = (1/runs) * (100 * value);
            const decimalOdds = (1/percentageChance) * 100;
            console.log(`${key} has a percentage chance of ${percentageChance}%.  Decimal odds: ${decimalOdds}`);
            result.push({
                team:key,
                probability:percentageChance,
                odds:decimalOdds
            })
        }
        console.table(winners);
        return result;
    }
    groups = [
        {
            /*
            group:'Group A',
            teams:[
                'Spain','Scotland','Norway','Georgia','Cyprus'
            ]

            group: 'Group E',
            teams:[
                'Moldova','Albania','Czech Republic','Poland','Faroe Islands'
            ] */

            group: 'Group C',
            teams:[
                'England','Italy','Ukraine','FYR Macedonia','Malta'
            ]
        }
    ]

    async getData(){
        let data = [];
        const {getData} = require('./soccerData');
        const rawdata = (await getData());
        rawdata.forEach((row) => {
            data.push({
                homeTeam:row.teams.home.name,
                awayTeam:row.teams.away.name,
                homeGoals:row.goals.home,
                awayGoals:row.goals.away,
                date:row.fixture.date
            })
        })
        console.log(data);
        this.filterDataIntoGroups(data);
    }

    filterDataIntoGroups(data){
        const groupAmatches = [];
        const groupAfutureMatches = [];
        const teams = new Set();

        data.forEach((row) => {
            if(true){//this.groups[0].teams.includes(row.homeTeam)){
                teams.add(row.homeTeam);

                if(row.homeGoals !== null)
                    groupAmatches.push(row);
                else
                    groupAfutureMatches.push(row);
            }
        })

        //const groupA = new Table(this.groups[0].teams,groupAmatches,groupAfutureMatches);
        const groupA = new Table(teams,groupAmatches,groupAfutureMatches);
        groupA.initTable();
        //groupA.simulateTable(10000,[1]);
        groupA.simulateTable(10000,[18,19,20]);

    }
}




exports.Table = Table;
exports.exportedForTesting = {
  
};

