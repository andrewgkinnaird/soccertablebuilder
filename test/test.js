const expect = require('chai').expect;
const {initTable,getTable,displayTable, updateTable} = require('../index');

describe('adding matches', () => {
    it('should update table stats when supplied a new match score', () => {
        initTable();
        let table = getTable();
        const match = {homeTeam:'England',awayTeam:'Ukraine', homeGoals:1, awayGoals:0};
        
        updateTable(match);

        /*
        ┌─────────┬───────────────┬───────────────────┬─────────────┬──────────┬────────────┬───────────┬──────────┬──────────────┬────────────────┬────────┐
        │ (index) │ tablePosition │       team        │ gamesPlayed │ gamesWon │ gamesDrawn │ gamesLost │ goalsFor │ goalsAgainst │ goalDifference │ points │
        ├─────────┼───────────────┼───────────────────┼─────────────┼──────────┼────────────┼───────────┼──────────┼──────────────┼────────────────┼────────┤
        │    0    │       1       │     'England'     │      7      │    6     │     1      │     0     │    20    │      3       │       17       │   19   │
        │    1    │       2       │     'Ukraine'     │      8      │    4     │     1      │     3     │    11    │      9       │       2        │   13   │

        */

        table = getTable();
        const newEnglandRow = table.find((row) => row.team === 'England');
        const newUkraineRow = table.find((row) => row.team === 'Ukraine');
        
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
    
    })

    it('should update table positions when a team overtakes another based on points', () => {
        initTable();
        let table = getTable();
        const match = {homeTeam:'England',awayTeam:'Ukraine', homeGoals:1, awayGoals:2};
        updateTable(match);
        updateTable(match);
        updateTable(match);
        
        /*
        ┌─────────┬───────────────┬───────────────────┬─────────────┬──────────┬────────────┬───────────┬──────────┬──────────────┬────────────────┬────────┐
        │ (index) │ tablePosition │       team        │ gamesPlayed │ gamesWon │ gamesDrawn │ gamesLost │ goalsFor │ goalsAgainst │ goalDifference │ points │
        ├─────────┼───────────────┼───────────────────┼─────────────┼──────────┼────────────┼───────────┼──────────┼──────────────┼────────────────┼────────┤
        │    0    │       1       │     'Ukraine'     │     10      │    7     │     1      │     2     │    17    │      11      │       6        │   22   │
        │    1    │       2       │     'England'     │      9      │    5     │     1      │     3     │    22    │      9       │       13       │   16   │

        */

        table = getTable();
        const newEnglandRow = table.find((row) => row.team === 'England');
        const newUkraineRow = table.find((row) => row.team === 'Ukraine');
        expect(newEnglandRow.points).to.be.equal(16);
        expect(newEnglandRow.tablePosition).to.be.equal(2);
        expect(newUkraineRow.points).to.be.equal(22);
        expect(newUkraineRow.tablePosition).to.be.equal(1);

    })

    it('should update table positions when a team overtakes another based on goal difference and points are equal', () => {
        initTable();
        let table = getTable();
        const match = {homeTeam:'England',awayTeam:'Ukraine', homeGoals:1, awayGoals:8};
        updateTable(match);
        
        /*
        ┌─────────┬───────────────┬───────────────────┬─────────────┬──────────┬────────────┬───────────┬──────────┬──────────────┬────────────────┬────────┐
        │ (index) │ tablePosition │       team        │ gamesPlayed │ gamesWon │ gamesDrawn │ gamesLost │ goalsFor │ goalsAgainst │ goalDifference │ points │
        ├─────────┼───────────────┼───────────────────┼─────────────┼──────────┼────────────┼───────────┼──────────┼──────────────┼────────────────┼────────┤
        │    0    │       1       │     'Ukraine'     │      8      │    5     │     1      │     2     │    19    │      9       │       10       │   16   │
        │    1    │       2       │     'England'     │      7      │    5     │     1      │     1     │    20    │      11      │       9        │   16   │

        */

        table = getTable();

        const newEnglandRow = table.find((row) => row.team === 'England');
        const newUkraineRow = table.find((row) => row.team === 'Ukraine');
        expect(newUkraineRow.goalDifference).to.be.greaterThan(newEnglandRow.goalDifference)
        expect(newEnglandRow.tablePosition).to.be.equal(2);
        expect(newUkraineRow.tablePosition).to.be.equal(1);

    })

    it('should update table positions when a team overtakes another based on goals for and points/goal difference are equal', () => {
        initTable();
        let table = getTable();
        const match1 = {homeTeam:'England',awayTeam:'Ukraine', homeGoals:2, awayGoals:8};
        updateTable(match1);
        const match2 = {homeTeam:'England',awayTeam:'Italy', homeGoals:0, awayGoals:1};
        updateTable(match2);

        /*
        ┌─────────┬───────────────┬───────────────────┬─────────────┬──────────┬────────────┬───────────┬──────────┬──────────────┬────────────────┬────────┐
        │ (index) │ tablePosition │       team        │ gamesPlayed │ gamesWon │ gamesDrawn │ gamesLost │ goalsFor │ goalsAgainst │ goalDifference │ points │
        ├─────────┼───────────────┼───────────────────┼─────────────┼──────────┼────────────┼───────────┼──────────┼──────────────┼────────────────┼────────┤
        │    0    │       1       │     'England'     │      8      │    5     │     1      │     2     │    21    │      12      │       9        │   16   │
        │    1    │       2       │     'Ukraine'     │      8      │    5     │     1      │     2     │    19    │      10      │       9        │   16   │

        */
       
        table = getTable();

        const newEnglandRow = table.find((row) => row.team === 'England');
        const newUkraineRow = table.find((row) => row.team === 'Ukraine');
        expect(newUkraineRow.goalDifference).to.be.equal(newEnglandRow.goalDifference);
        expect(newEnglandRow.goalsFor).to.be.greaterThan(newUkraineRow.goalsFor);
        expect(newEnglandRow.tablePosition).to.be.equal(1);
        expect(newUkraineRow.tablePosition).to.be.equal(2);

        const match3 = {homeTeam:'England',awayTeam:'Italy', homeGoals:0, awayGoals:0};
        updateTable(match3);
        const match4 = {homeTeam:'Ukraine',awayTeam:'Italy', homeGoals:10, awayGoals:10};
        updateTable(match4);

         /*
        (index) │ tablePosition │       team        │ gamesPlayed │ gamesWon │ gamesDrawn │ gamesLost │ goalsFor │ goalsAgainst │ goalDifference │ points │
        ├─────────┼───────────────┼───────────────────┼─────────────┼──────────┼────────────┼───────────┼──────────┼──────────────┼────────────────┼────────┤
        │    0    │       1       │     'Ukraine'     │      9      │    5     │     2      │     2     │    29    │      20      │       9        │   17   │
        │    1    │       2       │     'England'     │      9      │    5     │     2      │     2     │    21    │      12      │       9        │   17   │
       
        */

        expect(newUkraineRow.goalDifference).to.be.equal(newEnglandRow.goalDifference);
        expect(newEnglandRow.goalsFor).to.be.lessThan(newUkraineRow.goalsFor);
        expect(newEnglandRow.tablePosition).to.be.equal(2);
        expect(newUkraineRow.tablePosition).to.be.equal(1);

       
        
    })
})