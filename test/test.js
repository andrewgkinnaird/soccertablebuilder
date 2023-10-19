const expect = require('chai').expect;
const {initTable,getTable,displayTable, updateTable} = require('../index');

describe('adding matches', () => {
    it('should update table stats when supplied a new match score', () => {
        initTable();
        let table = getTable();
        const match = {homeTeam:'England',awayTeam:'Ukraine', homeGoals:1, awayGoals:0};
        
        table = updateTable(match,table);
        const newEnglandRow = table.find((row) => row.team === 'England');
        
        expect(newEnglandRow.gamesPlayed).to.be.equal(7);
        expect(newEnglandRow.gamesWon).to.be.equal(6);
        expect(newEnglandRow.gamesDrawn).to.be.equal(1);
        expect(newEnglandRow.gamesLost).to.be.equal(0);
        expect(newEnglandRow.goalsFor).to.be.equal(20);
        expect(newEnglandRow.goalsAgainst).to.be.equal(3);
        expect(newEnglandRow.goalDifference).to.be.equal(17);
        expect(newEnglandRow.points).to.be.equal(19);
        

        displayTable(table);
    })

    it('should update table positions when supplied a new match score', () => {
        initTable();
        let table = getTable();
        const match = {homeTeam:'England',awayTeam:'Ukraine', homeGoals:1, awayGoals:2};
        table = updateTable(match,table);
        table = updateTable(match,table);
        table = updateTable(match,table);

        const newEnglandRow = table.find((row) => row.team === 'England');
        expect(newEnglandRow.gamesLost).to.be.equal(3);
        expect(newEnglandRow.tablePosition).to.be.equal(2);
        displayTable(table);
    })
})