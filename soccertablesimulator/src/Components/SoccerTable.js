import {Button,Table,TableContainer,TableHead,TableBody,TableCell,TableRow,Paper} from '@material-ui/core';
import {englishPremierTeams} from '../testData';


export  const SoccerTable = () =>  {
    return (
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Club</TableCell>
            <TableCell align="right">P</TableCell>
            <TableCell align="right">W</TableCell>
            <TableCell align="right">D</TableCell>
            <TableCell align="right">L</TableCell>
            <TableCell align="right">GF</TableCell>
            <TableCell align="right">GA</TableCell>
            <TableCell align="right">Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {englishPremierTeams.map((team) => (
              
              
                <TableRow>{team}</TableRow>
              
            ))} 
        </TableBody>
      </Table>
    </TableContainer>
    )
}

