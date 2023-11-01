const expect = require('chai').expect;
const {Table} = require('../index');

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
    {homeTeam:'Italy',awayTeam:'North Macedonia',date:new Date("2023-17-11T20:45:00"),homeGoals:null,awayGoals:null,homeChance:0.6,drawChance:0.25,awayChance:0.15},
    {homeTeam:'England',awayTeam:'Malta',date:new Date("2023-17-11T20:45:00"),homeGoals:null,awayGoals:null,homeChance:0.92,drawChance:0.07,awayChance:0.01},
    {homeTeam:'North Macedonia',awayTeam:'England',date:new Date("2023-20-11T20:45:00"),homeGoals:null,awayGoals:null,homeChance:0.15,drawChance:0.25,awayChance:0.6},
    {homeTeam:'Ukraine',awayTeam:'Italy',date:new Date("2023-20-11T20:45:00"),homeGoals:null,awayGoals:null,homeChance:0.25,drawChance:0.3,awayChance:0.45},
]

describe('updating tables', () => {

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

    

    
})

describe('simulations', () => {
    it('should simulate future matches for Euro2024 Group C', () => {
        const table = new Table(teams,matches,futureMatches);
        table.initTable();
        const results = table.simulateTable(50000,[1,2]);
        expect(results).to.be.a('array');
        expect(results.some((result) => result.team === 'England')).to.be.true;
        expect(results.some((result) => result.team === 'Italy')).to.be.true;
        expect(results.some((result) => result.team === 'Ukraine')).to.be.true;
        expect(results.find((result) => result.team === 'England').probability).to.be.approximately(100,1);
        expect(results.find((result) => result.team === 'Italy').probability).to.be.approximately(55,1);
        expect(results.find((result) => result.team === 'Ukraine').probability).to.be.approximately(45,1);
        expect(results.find((result) => result.team === 'England').odds).to.be.approximately(1,0.01);
        expect(results.find((result) => result.team === 'Italy').odds).to.be.approximately(1.8,0.1);
        expect(results.find((result) => result.team === 'Ukraine').odds).to.be.approximately(2.2,0.1);
       
    })

    it('should simulate future matches for Euro2024 Group E', () => {
        const teams2 = ['Albania','Czech Republic','Poland','Moldova','Faroe Islands'];
        const matches2 = [
            {homeTeam:'Czech Republic',awayTeam:'Poland',date:new Date("2023-17-10T20:45:00"),homeGoals:3,awayGoals:1},
            {homeTeam:'Moldova',awayTeam:'Faroe Islands',date:new Date("2023-17-10T20:45:00"),homeGoals:1,awayGoals:1},
            {homeTeam:'Moldova',awayTeam:'Czech Republic',date:new Date("2023-17-10T20:45:00"),homeGoals:0,awayGoals:0},
            {homeTeam:'Poland',awayTeam:'Albania',date:new Date("2023-17-10T20:45:00"),homeGoals:1,awayGoals:0},
            {homeTeam:'Albania',awayTeam:'Moldova',date:new Date("2023-17-10T20:45:00"),homeGoals:2,awayGoals:0},
            {homeTeam:'Faroe Islands',awayTeam:'Czech Republic',date:new Date("2023-17-10T20:45:00"),homeGoals:0,awayGoals:3},
            {homeTeam:'Faroe Islands',awayTeam:'Albania',date:new Date("2023-17-10T20:45:00"),homeGoals:1,awayGoals:3},
            {homeTeam:'Moldova',awayTeam:'Poland',date:new Date("2023-17-10T20:45:00"),homeGoals:3,awayGoals:2},
            {homeTeam:'Czech Republic',awayTeam:'Albania',date:new Date("2023-17-10T20:45:00"),homeGoals:1,awayGoals:1},
            {homeTeam:'Poland',awayTeam:'Faroe Islands',date:new Date("2023-17-10T20:45:00"),homeGoals:2,awayGoals:0},
            {homeTeam:'Faroe Islands',awayTeam:'Moldova',date:new Date("2023-17-10T20:45:00"),homeGoals:0,awayGoals:1},
            {homeTeam:'Albania',awayTeam:'Poland',date:new Date("2023-17-10T20:45:00"),homeGoals:2,awayGoals:0},
            {homeTeam:'Albania',awayTeam:'Czech Republic',date:new Date("2023-17-10T20:45:00"),homeGoals:3,awayGoals:0},
            {homeTeam:'Faroe Islands',awayTeam:'Poland',date:new Date("2023-17-10T20:45:00"),homeGoals:0,awayGoals:2},
            {homeTeam:'Czech Republic',awayTeam:'Faroe Islands',date:new Date("2023-17-10T20:45:00"),homeGoals:1,awayGoals:0},
            {homeTeam:'Poland',awayTeam:'Moldova',date:new Date("2023-17-10T20:45:00"),homeGoals:1,awayGoals:1},
            
        ]
        const futureMatches2 = [
            {homeTeam:'Moldova',awayTeam:'Albania',date:new Date("2023-17-11T20:45:00"),homeGoals:null,awayGoals:null,homeChance:0.25,drawChance:0.30,awayChance:0.45},
            {homeTeam:'Poland',awayTeam:'Czech Republic',date:new Date("2023-17-11T20:45:00"),homeGoals:null,awayGoals:null,homeChance:0.3,drawChance:0.4,awayChance:0.3},
            {homeTeam:'Albania',awayTeam:'Faroe Islands',date:new Date("2023-17-11T20:45:00"),homeGoals:null,awayGoals:null,homeChance:0.85,drawChance:0.1,awayChance:0.05},
            {homeTeam:'Czech Republic',awayTeam:'Moldova',date:new Date("2023-17-11T20:45:00"),homeGoals:null,awayGoals:null,homeChance:0.5,drawChance:0.25,awayChance:0.25},
        ];

        const table = new Table(teams2,matches2,futureMatches2);
        table.initTable();
        const results = table.simulateTable(50000,[1]);
        expect(results).to.be.a('array');
        expect(results.some((result) => result.team === 'Albania')).to.be.true;
        expect(results.some((result) => result.team === 'Czech Republic')).to.be.true;
        expect(results.some((result) => result.team === 'Moldova')).to.be.true;
        expect(results.find((result) => result.team === 'Albania').probability).to.be.approximately(92,1);
        expect(results.find((result) => result.team === 'Czech Republic').probability).to.be.approximately(6,1);
        expect(results.find((result) => result.team === 'Moldova').probability).to.be.approximately(1,1);
        expect(results.find((result) => result.team === 'Albania').odds).to.be.approximately(1.08,0.02);
        expect(results.find((result) => result.team === 'Czech Republic').odds).to.be.approximately(16,2);
        expect(results.find((result) => result.team === 'Moldova').odds).to.be.approximately(73,10);
    })

    it.only('should simulate English Premier League', () => {
        const {englishPremierTeams,futurePremierLeagueMatches,premierLeagueMatches} = require('./testData')
        const table = new Table(englishPremierTeams, premierLeagueMatches, futurePremierLeagueMatches);
        table.initTable();
        /*let results = table.simulateTable(10000,[1]);
        console.log('winner',results);
        results = table.simulateTable(10000,[1,2,3,4]);
        console.log('top 4',results);
        results = table.simulateTable(10000,[18,19,20]);
        console.log('relegation',results);
        results = table.simulateTable(10000,[20]);
        console.log('bottom',results);*/
        results = table.simulateTable(10000,[1,2,3,4,5,6,7,8,9,10]);
        console.log('top ten',results);
        
    })
    /*
    describe('loading soccer data into memory', () => {
        it('should load data from external source',async () => {
            const table = new Table(teams,matches);
            await table.getData();
        })
    })*/
})