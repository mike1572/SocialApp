
import React, { useEffect, useState } from "react";

import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/wolf.png';

// MUI stuff
import Grid from '@material-ui/core/Grid'
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress";

import { Link } from "react-router-dom";

// Redux stuff
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

const styles = {
 
    form: {
        textAlign: 'center'
    }, 
    image : {
        margin: '20px auto 20px auto', 
        maxWidth: 150
    },
    pageTitle : {
        margin: '10px auto 10px auto', 
    }, 
    textField : {
        margin: '10px auto 10px auto', 
    }, 
    button: {
        marginTop: 20,
        positon: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem', 
        marginTop: 10
    },
    progress: {
        positon: 'absolute'
    }
}


let Login = (props) => {

    //console.log(props.UI.errors)
    const { classes, UI: { loading } } = props;
    

    let useTrait = (initialValue) => {
   
        let [errors, setErrors] = useState(initialValue);
     
        let current = errors;
     
        const get = () => current;
     
        const set = newValue => {
           current = newValue;
           setErrors(newValue);
           return current;
        }
     
        return {
           get,
           set,
        }
    }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let errors = useTrait({errors: props.UI.errors})
 
    useEffect(()=> {
   
        if (props.UI.errors){
            errors.set(props.UI.errors)            
        }
        
    }, [props.UI.errors])


    let handleSubmit = (event) => {
        event.preventDefault();
        
        const userData = {
            email: email, 
            password: password
        }

        props.loginUser(userData, props.history)

    }

    let handleChange = (event) => {
        if (event.target.name === 'email'){
            setEmail(event.target.value)
        } else if (event.target.name === 'password'){
            setPassword(event.target.value)
        };
    }

    return (
        <Grid container className={classes.form}>
            <Grid item sm/>
            <Grid item sm>
                <img src={AppIcon} alt="Wolf Image" className={classes.image}/>
                <Typography variant="h3" className={classes.pageTitle}>
                    Login
                </Typography>
                <form noValidate onSubmit={handleSubmit} >
                    <TextField id="email" name="email" type="email" label="Email" 
                        className={classes.textField} helperText={errors.get().email} error={errors.get().email ? true : false} value={email} onChange={handleChange} fullWidth/>
                    <TextField id="password" name="password" type="password" label="Password" 
                        className={classes.textField} helperText={errors.get().password} error={errors.get().password ? true : false} value={password} onChange={handleChange} fullWidth/>
                    {errors.get().general && (
                        <Typography variant="body2" className={classes.customError}>
                            {errors.get().general}
                        </Typography>
                    )}
                    <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading} >
                        Login
                        {loading && 
                            <CircularProgress size={20} className={classes.progress}/>
                        }
                    </Button>
                    <br/>
                    <small>Don't have an account? Sign up <Link to="/signup">here</Link></small>
                    
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    )

}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired, 
    user: PropTypes.object.isRequired, 
    UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user, 
    UI: state.ui, 
})

const mapActionsToProps = {
    loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));







