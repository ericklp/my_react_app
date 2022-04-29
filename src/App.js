import React, { Fragment } from 'react';
import avatarImg from './avatar.jpg';
import './App.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function App() {
  return (
    <div className="App">
    <header className="App-header">
      <Fragment>
          <Box className="App-header" flexDirection="column" display="flex" >
            <Avatar alt="Erick Lopes" src={avatarImg} />
            <p> Erick Lopes </p>
            <Button variant="contained">
              Começar
          </Button>
          </Box>
      </Fragment>
    </header>
    </div>
  );
}

export default App;