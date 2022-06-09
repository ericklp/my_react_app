import React, { useEffect, Fragment } from 'react';
import { collection, getDocs, getDoc, doc, setDoc, onSnapshot } from "firebase/firestore"; 


import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { auth, logout, db } from './firebase';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const pages = [''];
const settings = ['Account', 'Logout'];

const getValuesForCard = () => {
    const fibonacci = [1, 2, 3, 5, 8, 13, 21];
    let buttonObject = [];
    for (let i = 0; i < fibonacci.length; i++) {
        buttonObject.push({
            value: fibonacci[i]
        })
    }
    return buttonObject;
};

const ToogleGroupObject = ({user}) => {
    const [selectedCard, setSelectedCard] = React.useState();

    const handleSelectedCard = (event, card) => {
      setSelectedCard(card);
      updateFirestoreVote(card, user)
    };

    const updateFirestoreVote = (vote, user) => {
        setVotes(vote, user)
    }

    return (    
        <ToggleButtonGroup
            exclusive
            value={selectedCard}
            onChange={handleSelectedCard}
        >
            {getValuesForCard().map((card, index) => (
                <ToggleButton 
                    key={index}
                    variant="outlined" 
                    style={{maxWidth: '130px',
                            maxHeight: '130px',
                            minWidth: '130px',
                            minHeight: '130px'}}
                    value={card.value}
                >
                    {card.value}
                </ToggleButton>))}
        </ToggleButtonGroup>
    )
}

async function getRooms() {
    const querySnapshot = await getDocs(collection(db, "rooms"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
}

async function getRoomPlayers() {
    const docRef = doc(db, "rooms", "n69KKt9PD73br3iza1Gi");
    const room = await getDoc(docRef);

    if (room.exists() && room.data().users) {
      return Promise.resolve(room.data().users);
    } else {
      return Promise.reject("No such room!")
    }
}

const getCurrentUserIndex = (allPlayers, currentUser) => {
    const userId = currentUser.uid
    for (let i=0; i<allPlayers.length; i++) {
        if (allPlayers[i].id === userId) {
            return i;
        }
    }
    console.log(`No user with id ${userId}`);  
    return false;
}

async function setVotes(vote, user) {
    const players = await getRoomPlayers()
    players[getCurrentUserIndex(players, user)].vote = vote

    console.log("updated player data:", players);
    const room = doc(db, 'rooms', 'n69KKt9PD73br3iza1Gi');
    setDoc(room, {"users": players}, { merge: true });
}

async function setFirestoreRevealVotes(revealVote) {
    console.log("updating reveal votes to:", revealVote);
    const room = doc(db, 'rooms', 'n69KKt9PD73br3iza1Gi');
    setDoc(room, {revealVotes: revealVote}, { merge: true });
}

async function getFirestoreRevealVotes() {
    const docRef = doc(db, 'rooms', 'n69KKt9PD73br3iza1Gi');
    const room = await getDoc(docRef);
    return room.revealVotes;
}

async function clearAllVotes() {
    const players = await getRoomPlayers()
    for (let i=0; i<players.length; i++) {
        players[i].vote = null;
    };
    console.log("cleared all votes:");
    const room = doc(db, 'rooms', 'n69KKt9PD73br3iza1Gi');
    setDoc(room, {"users": players}, { merge: true });
}

async function addUserToRoom(user) {
    const room = doc(db, 'rooms', 'n69KKt9PD73br3iza1Gi');

    getRoomPlayers().then((players) => {
        if(getCurrentUserIndex(players, user) === false) {        
            players.push({  'id': user.uid,
                            'name': user.displayName,
                            'vote': ''});
            setDoc(room, {"users": players}, { merge: true });
            console.log(`added user [${user.displayName}] with id ${user.uid}`);
        }
    }).catch(() => {
        const player = [{'id': user.uid,
                        'name': user.displayName,
                        'vote': ''}];
        setDoc(room, {"users": player}, { merge: true });
        console.log(`added user [${user.displayName}] with id ${user.uid}`);
    })
}

const RoomPlayers = () => {
    const [players, setPlayers] = React.useState([]);
    const [revealVotes, setRevealVotes] = React.useState(false);

    const getFirestoreUpdates = () => {
        const unsub = onSnapshot(doc(db, "rooms", "n69KKt9PD73br3iza1Gi"), (doc) => {
            const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            console.log(source);
            console.log("Current data: ", doc.data());

            setPlayers(doc.data().users);
            if(doc.data().revealVotes)
                setRevealVotes(doc.data().revealVotes);
        });
    };

    useEffect(() => {
        getFirestoreUpdates();
    }, []);

    const getVoteText = (vote) => {
        if (revealVotes) {
            if(vote===null) {
                return `<user did not vote>`;
            }
            return `Voted: ${vote}`;
        } 
        if(vote) {
            return 'Already voted';
        }
        return 'user has not voted yet';
    }

    const getVotes = () => {
        console.log(`revealVotes: ${revealVotes}`);
        const reveal = revealVotes
        setRevealVotes(!reveal);
        setFirestoreRevealVotes(!reveal);
    }

    const clearVoting = () => {
        clearAllVotes();
        setFirestoreRevealVotes(false);
    }

    return (
        <Fragment>
            <List>
                {players?.map((player, index) => (
                <ListItem key={index}>
                        <ListItemText 
                            primary={player?.name} />
                        <ListItemText 
                            primary={getVoteText(player?.vote)} />
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" onClick={getVotes}>{revealVotes ? 'Restart voting' : 'Reveal Votes'}</Button>
            <Button variant="outlined" onClick={clearVoting}>Clear Voting</Button>
        </Fragment>
    )
}


const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    logout();
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      navigate("/");
    } else {
        addUserToRoom(user);
    }
  }, [user, loading]);

  return (
    <Fragment>
        <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
            <BrokenImageIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                Poker Planning
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                >
                <MenuIcon />
                </IconButton>
                <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                    display: { xs: 'block', md: 'none' },
                }}
                >
                {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                ))}
                </Menu>
            </Box>
            <BrokenImageIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                Poker Planning
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    {page}
                </Button>
                ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.displayName} src={user?.photoURL} />
                </IconButton>
                </Tooltip>
                <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
                </Menu>
            </Box>
            </Toolbar>
        </Container>
        </AppBar>

        <div className="app">
            <ToogleGroupObject user={user}/>
            <RoomPlayers user={user}/>
        </div>
    </Fragment>

  );
};
export default ResponsiveAppBar;
