
import React, { Fragment} from "react";
import { Link } from "react-router-dom";
import {connect} from 'react-redux';
import PropTypes from 'prop-types'

import MyButton from "../../util/MyButton";
import PostScream from "../scream/PostScream";
import Notifications from './Notifications'
// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button'

//Icons
import HomeIcon from '@material-ui/icons/Home';

let NavBar = (props) => {

    const { authenticated } = props;
    return (
        <AppBar>
            <Toolbar className="nav-container">
                {authenticated ? (
                    <Fragment>
                        <PostScream/>
                        <Link to="/">
                            <MyButton tip='Home'>
                                <HomeIcon/>
                            </MyButton> 
                        </Link>
                        
                        <Notifications/>
                        
                        
                    </Fragment>
                ): (
                    <Fragment>
                        <Button color='inherit' component={Link} to="/">Home</Button>
                        <Button color='inherit' component={Link} to="/login">Login</Button>
                        <Button color='inherit' component={Link} to="/signup">Sign up</Button>

                    </Fragment>    
                )}

            </Toolbar>
        </AppBar>
    )

}

NavBar.propTypes = {
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps)(NavBar);


