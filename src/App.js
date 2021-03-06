import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createTheme';
import jwtDecode from 'jwt-decode';

//Redux 
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

//Components
import NavBar from './components/layout/Navbar';
import themeFile from './util/theme';
import AuthRoute from './util/AuthRoute';

//Pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import User from './pages/user';

import axios from 'axios';

const theme = createTheme(themeFile);


const token = localStorage.FBIdToken;

if (token){

  const decodedToken = jwtDecode(token)
  if (decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser())
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED })
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData())
  }
}


function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>        
        <Router>
          <NavBar/>
          <div className="container">  
            <Switch>
              <Route exact path="/" component={Home}/>
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/signup" component={Signup} />
              <Route exact path="/users/:handle" component={User}/>
              <Route exact path="/users/:handle/scream/:screamId" component={User}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
