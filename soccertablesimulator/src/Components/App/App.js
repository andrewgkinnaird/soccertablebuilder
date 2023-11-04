import {SoccerTable} from '../SoccerTable'
import './App.css';
import * as React from 'react';
import {Button} from '@material-ui/core';


function App() {
  return (
    <div>
    <SoccerTable/>
    <Button variant="contained" color="primary">Simulate</Button>
    </div>
  );
}


export default App;
