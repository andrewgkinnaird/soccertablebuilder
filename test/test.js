const expect = require('chai').expect;
const {initTable,getTable,displayTable, updateTable} = require('../index');

describe('adding matches', () => {
    it('should update table when supplied a new match score', () => {
        initTable();
        let table = getTable();
        const match = ['England','Ukraine', 1, 0];
        const newEnglandRow = table.find((row) => row.team === 'England');
        table = updateTable(match,table);

        expect(newEnglandRow.tablePostion).to.be.equal(1);
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
})