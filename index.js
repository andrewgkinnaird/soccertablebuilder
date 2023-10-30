

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
        this.displayTable();
        
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
        subGroup.displayTable();

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

    simulate(runs){
        const winners = new Map();

        for(let i=0; i<runs; i++){
            this.initTable();
            this.futureMatches.forEach((match) => {
                const homeGoals = Math.floor(4 * Math.random());
                const awayGoals = Math.floor(4 * Math.random());
                match.homeGoals = homeGoals;
                match.awayGoals = awayGoals;
                this.updateTable(match);
                this.sortWithoutH2H();
            });
            const winner = this.tableRows[2].team;
            winners.set(winner, (winners.get(winner) || 0) + 1); 
        }
        console.table(winners);
    }

}




exports.Table = Table;
exports.exportedForTesting = {
  
};