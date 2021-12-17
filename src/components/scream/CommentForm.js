
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";

// MUI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

//Redux
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

const styles = (theme) => ({
    theme,
    button: {
        marginTop: 20,
        position: 'relative'
    },
})

let CommentForm = (props) => {
    let [body, setBody] = useState('');

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
    let errors = useTrait({})

    useEffect(()=> {
   
        if (props.UI.errors){
            errors.set(props.UI.errors)            
        }

        if (!props.UI.errors && !props.UI.loading){
           setBody('')
        }
        
    }, [props.UI.errors, props.UI.loading])

    const { classes, authenticated } = props;

    let handleChange = (event) => {
        if (event.target.name === 'body'){
            setBody(event.target.value)
        }
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        props.submitComment(props.screamId, { body })
        setBody('')
    }

    let commentFormMarkup = authenticated ? (
        <Grid item sm={12} style={{ textAlign: 'center'}}>
            <form onSubmit={handleSubmit}>
                <TextField name="body" type="text" 
                    label="Comment on scream"
                    error={errors.get().comment ? true: false}
                    helperText={errors.get().comment}
                    value={body}
                    onChange={handleChange}
                    fullWidth
                    className={classes.textField}
                />
                <Button type="submit" variant="contained" color="primary"
                    className={classes.button}>Submit</Button>
                
            </form>
            <hr className={classes.visibleSeparator} />
        </Grid>
    ): null;
    
    return commentFormMarkup;
}


CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    classese: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    UI: state.ui,
    authenticated: state.user.authenticated
})


export default connect(mapStateToProps, { submitComment }) (withStyles(styles)(CommentForm));




