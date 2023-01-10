import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import AuthContext from '../../AuthContext';
import { makeRequest } from '../../utils/axios_wrapper';
import { drawerWidth } from '../../utils/constants';
import Admin from '../Admin';
import NotificationList from '../NotificationList';
import PollToggle from '../PollToggle';
import SearchBar from '../Search/SearchBar';

const useStyles = makeStyles(theme => ({
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logoutButton: {
    float: 'right',
  },
}));

function Header({ handleMenuToggle = () => {} }) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const token = React.useContext(AuthContext);
  const [loggedOut, setLoggedOut] = React.useState(false);

  if (loggedOut) {
    makeRequest('POST', 'AUTH_LOGOUT', { token })
        .then(response => {
          console.log(response);
        })
        .catch(err => console.log(err));
    localStorage.removeItem('token');
    localStorage.removeItem('uId');
    return <Redirect to="/login"/>;
  }

  return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {!matches && (
              <>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleMenuToggle}
                    className={classes.menuButton}
                >
                  <MenuIcon/>
                </IconButton>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  <Typography variant="h5" noWrap>Memes</Typography>
                </Link>
              </>
          )}
          <div variant="h6" className={classes.title}></div>
          <div style={{ display: 'flex' }}>
            <SearchBar/>
            <PollToggle/>
            <NotificationList/>
            <Admin/>
            <Button
                color="inherit"
                className={classes.logoutButton}
                onClick={() => {
                  setLoggedOut(true);
                }}
            >
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
  );
}

export default Header;
