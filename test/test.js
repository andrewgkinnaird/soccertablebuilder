const expect = require('chai').expect;
const {initTable,getTable,displayTable, updateTable, exportedForTesting, Table} = require('../index');

const teams = ['England','Italy','North Macedonia','Ukraine','Malta'];
const matches = [
    {homeTeam:'Italy',awayTeam:'England',date:new Date("2023-03-23T20:45:00"),homeGoals:1,awayGoals:2},
    {homeTeam:'North Macedonia',awayTeam:'Malta',date:new Date("2023-03-23T20:45:00"),homeGoals:2,awayGoals:1},
    {homeTeam:'England',awayTeam:'Ukraine',date:new Date("2023-03-26T18:00:00"),homeGoals:2,awayGoals:0},
    {homeTeam:'Malta',awayTeam:'Italy',date:new Date("2023-03-26T20:45:00"),homeGoals:0,awayGoals:2},
    {homeTeam:'Malta',awayTeam:'England',date:new Date("2023-6-16T20:45:00"),homeGoals:0,awayGoals:4},
    {homeTeam:'North Macedonia',awayTeam:'Ukraine',date:new Date("2023-6-16T20:45:00"),homeGoals:2,awayGoals:3},
    {homeTeam:'Ukraine',awayTeam:'Malta',date:new Date("2023-6-19T18:00:00"),homeGoals:1,awayGoals:0},
    {homeTeam:'England',awayTeam:'North Macedonia',date:new Date("2023-6-19T20:45:00"),homeGoals:7,awayGoals:0},
    {homeTeam:'Ukraine',awayTeam:'England',date:new Date("2023-9-9T18:00:00"),homeGoals:1,awayGoals:1},
    {homeTeam:'North Macedonia',awayTeam:'Italy',date:new Date("2023-9-9T20:45:00"),homeGoals:1,awayGoals:1},
    {homeTeam:'Italy',awayTeam:'Ukraine',date:new Date("2023-9-12T20:45:00"),homeGoals:2,awayGoals:1},
    {homeTeam:'Malta',awayTeam:'North Macedonia',date:new Date("2023-9-12T20:45:00"),homeGoals:0,awayGoals:2},
    {homeTeam:'Ukraine',awayTeam:'North Macedonia',date:new Date("2023-14-10T15:00:00"),homeGoals:2,awayGoals:0},
    {homeTeam:'Italy',awayTeam:'Malta',date:new Date("2023-14-10T20:45:00"),homeGoals:4,awayGoals:0},
    {homeTeam:'England',awayTeam:'Italy',date:new Date("2023-17-10T20:45:00"),homeGoals:3,awayGoals:1},
    {homeTeam:'Malta',awayTeam:'Ukraine',date:new Date("2023-17-10T20:45:00"),homeGoals:1,awayGoals:3}
]
const futureMatches = [
    {homeTeam:'Italy',awayTeam:'North Macedonia',date:new Date("2023-17-11T20:45:00"),homeGoals:null,awayGoals:null},
    {homeTeam:'England',awayTeam:'Malta',date:new Date("2023-17-11T20:45:00"),homeGoals:null,awayGoals:null},
    {homeTeam:'North Macedonia',awayTeam:'England',date:new Date("2023-20-11T20:45:00"),homeGoals:null,awayGoals:null},
    {homeTeam:'Ukraine',awayTeam:'Italy',date:new Date("2023-20-11T20:45:00"),homeGoals:null,awayGoals:null},
    
]

describe('adding matches', () => {

    it('should update table object when supplied a new match score', () => {
        const table = new Table(teams,matches);
        table.initTable();

        const match = {homeTeam:'England',awayTeam:'Ukraine', homeGoals:1, awayGoals:0};
        table.updateTable(match);

        /*
        ┌─────────┬───────────────┬───────────────────┬─────────────┬──────────┬────────────┬───────────┬──────────┬──────────────┬────────────────┬────────┐
        │ (index) │ tablePosition │       team        │ gamesPlayed │ gamesWon │ gamesDrawn │ gamesLost │ goalsFor │ goalsAgainst │ goalDifference │ points │
        ├─────────┼───────────────┼───────────────────┼─────────────┼──────────┼────────────┼───────────┼──────────┼──────────────┼────────────────┼────────┤
        │    0    │       1       │     'England'     │      7      │    6     │     1      │     0     │    20    │      3       │       17       │   19   │
        │    1    │       2       │     'Ukraine'     │      8      │    4     │     1      │     3     │    11    │      9       │       2        │   13   │

        */

        const newEnglandRow = table.tableRows.find((row) => row.team === 'England');
        const newUkraineRow = table.tableRows.find((row) => row.team === 'Ukraine');
        
        expect(newEnglandRow.gamesPlayed).to.be.equal(7);
        expect(newEnglandRow.gamesWon).to.be.equal(6);
        expect(newEnglandRow.gamesDrawn).to.be.equal(1);
        expect(newEnglandRow.gamesLost).to.be.equal(0);
        expect(newEnglandRow.goalsFor).to.be.equal(20);
        expect(newEnglandRow.goalsAgainst).to.be.equal(3);
        expect(newEnglandRow.goalDifference).to.be.equal(17);
        expect(newEnglandRow.points).to.be.equal(19);

        expect(newUkraineRow.gamesPlayed).to.be.equal(8);
        expect(newUkraineRow.gamesWon).to.be.equal(4);
        expect(newUkraineRow.gamesDrawn).to.be.equal(1);
        expect(newUkraineRow.gamesLost).to.be.equal(3);
        expect(newUkraineRow.goalsFor).to.be.equal(11);
        expect(newUkraineRow.goalsAgainst).to.be.equal(9);
        expect(newUkraineRow.goalDifference).to.be.equal(2);
        expect(newUkraineRow.points).to.be.equal(13);
    });

  

    

    it('should update table positions when a team attains the same points as another, and beats them on H2H', () => {
        const table = new Table(teams,matches);
        table.initTable();

        const match = {homeTeam:'Italy',awayTeam:'North Macedonia', homeGoals:0, awayGoals:1};
        table.updateTable(match); 
        table.sort();
        const newItalyRow = table.tableRows.find((row) => row.team === 'Italy');
        const newMacedoniaRow = table.tableRows.find((row) => row.team === 'North Macedonia');
        
        expect(newItalyRow.points).to.be.equal(10);
        expect(newMacedoniaRow.points).to.be.equal(10);
        expect(table.getTablePosition('North Macedonia')).to.be.equal(3);
        expect(table.getTablePosition('Italy')).to.be.equal(4);
    });
    
    it('should update table positions when a team overtakes another based on points', () => {
        const table = new Table(teams,matches);
        table.initTable();
        const match = {homeTeam:'England',awayTeam:'Ukraine', homeGoals:1, awayGoals:2};
        table.updateTable(match);
        table.updateTable(match);
        table.updateTable(match);
        table.sort();
        
        /*
        ┌─────────┬───────────────┬───────────────────┬─────────────┬──────────┬────────────┬───────────┬──────────┬──────────────┬────────────────┬────────┐
        │ (index) │ tablePosition │       team        │ gamesPlayed │ gamesWon │ gamesDrawn │ gamesLost │ goalsFor │ goalsAgainst │ goalDifference │ points │
        ├─────────┼───────────────┼───────────────────┼─────────────┼──────────┼────────────┼───────────┼──────────┼──────────────┼────────────────┼────────┤
        │    0    │       1       │     'Ukraine'     │     10      │    7     │     1      │     2     │    17    │      11      │       6        │   22   │
        │    1    │       2       │     'England'     │      9      │    5     │     1      │     3     │    22    │      9       │       13       │   16   │

        */

        
        const newEnglandRow = table.tableRows.find((row) => row.team === 'England');
        const newUkraineRow = table.tableRows.find((row) => row.team === 'Ukraine');
        expect(newEnglandRow.points).to.be.equal(16);
        expect(table.getTablePosition('England')).to.be.equal(2);
        expect(newUkraineRow.points).to.be.equal(22);
        expect(table.getTablePosition('Ukraine')).to.be.equal(1);

    })

    

    it('should update table positions when a team overtakes another based on goals for and H2H/points/goal difference are equal', () => {
        const table = new Table(teams,matches);
        table.initTable();
        const match1 = {homeTeam:'England',awayTeam:'Ukraine', homeGoals:0, awayGoals:2}; // H2H is now equal
        table.updateTable(match1);
        const match2 = {homeTeam:'England',awayTeam:'Italy', homeGoals:0, awayGoals:9};
        table.updateTable(match2);
        table.sort();

        /*
        ┌─────────┬───────────────┬───────────────────┬─────────────┬──────────┬────────────┬───────────┬──────────┬──────────────┬────────────────┬────────┐
        │ (index) │ tablePosition │       team        │ gamesPlayed │ gamesWon │ gamesDrawn │ gamesLost │ goalsFor │ goalsAgainst │ goalDifference │ points │
        ├─────────┼───────────────┼───────────────────┼─────────────┼──────────┼────────────┼───────────┼──────────┼──────────────┼────────────────┼────────┤
        │    0    │       1       │     'England'     │      8      │    5     │     1      │     2     │    19    │      14      │       5        │   16   │
        │    1    │       2       │     'Ukraine'     │      8      │    5     │     1      │     2     │    13    │      8       │       5        │   16   │

        */
       
        const newEnglandRow = table.tableRows.find((row) => row.team === 'England');
        const newUkraineRow = table.tableRows.find((row) => row.team === 'Ukraine');
        expect(newUkraineRow.goalDifference).to.be.equal(newEnglandRow.goalDifference);
        expect(newEnglandRow.goalsFor).to.be.greaterThan(newUkraineRow.goalsFor);
        expect(table.getTablePosition('England')).to.be.equal(1);
        expect(table.getTablePosition('Ukraine')).to.be.equal(2);


        const match3 = {homeTeam:'England',awayTeam:'Italy', homeGoals:0, awayGoals:0};
        table.updateTable(match3);
        const match4 = {homeTeam:'Ukraine',awayTeam:'Italy', homeGoals:10, awayGoals:10};
        table.updateTable(match4);
        table.sort();
        
         /*
        (index) │ tablePosition │       team        │ gamesPlayed │ gamesWon │ gamesDrawn │ gamesLost │ goalsFor │ goalsAgainst │ goalDifference │ points │
        ├─────────┼───────────────┼───────────────────┼─────────────┼──────────┼────────────┼───────────┼──────────┼──────────────┼────────────────┼────────┤
        │    0    │       1       │     'Ukraine'     │      9      │    5     │     2      │     2     │    29    │      20      │       9        │   17   │
        │    1    │       2       │     'England'     │      9      │    5     │     2      │     2     │    21    │      12      │       9        │   17   │
       
        */

        expect(newUkraineRow.goalDifference).to.be.equal(newEnglandRow.goalDifference);
        expect(newEnglandRow.goalsFor).to.be.lessThan(newUkraineRow.goalsFor);
        expect(table.getTablePosition('England')).to.be.equal(2);
        expect(table.getTablePosition('Ukraine')).to.be.equal(1);

       
        
    })

    it('should simulate future matches', () => {
        const table = new Table(teams,matches,futureMatches);
        table.initTable();
        table.simulate(100000);
        table.displayTable();
    })
})