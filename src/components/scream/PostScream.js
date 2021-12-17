
import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";

// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from '@material-ui/core/CircularProgress';
//Icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
//Redux
import {connect} from 'react-redux';
import {postScream, clearErrors } from "../../redux/actions/dataActions";

const styles = (theme) => ({
    
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10
    }, 
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%'

    }
})

let PostScream = (props) => {

    const [open, setOpen] = useState(false);
    const [body, setBody] = useState('');
    //const [errors, setErrors] = useState({})

    useEffect(()=> {
   
        if (props.UI.errors){
            errors.set(props.UI.errors)            
        }
        
        if(!props.UI.errors && !props.UI.loading){
            setBody('')
            setOpen(false)
            errors.set({})
        }

    }, [props.UI.errors, props.UI.loading])


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
    let handleOpen = () => {
        setOpen(true)
    }

    let handleClose = () => {
        props.clearErrors();
        setOpen(false)
        errors.set({})
    }

    let handleChange = (event) => {
        if (event.target.name === 'body'){
            setBody(event.target.value)
        }
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        props.postScream({ body })
        console.log(errors.get())
    }

    const { classes, UI: {loading} } = props;
    
    return (
        <Fragment>
            <MyButton onClick={handleOpen} tip='Post a scream!'>
                <AddIcon />
            </MyButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
                <MyButton tip="Close" onClick={handleClose} tipClassName={classes.closeButton}>
                    <CloseIcon/>
                </MyButton>
                <DialogTitle>Post a new scream</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="body"
                            type="text"
                            label="SCREAM!!!"
                            multiline
                            rows="3"
                            placeholder="Scream at will!"
                            error={errors.get().body ? true : false}
                            helperText={errors.get().body}
                            className={classes.textField}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Button type="submit" variant="contained" color="primary" 
                            className={classes.submitButton} disabled={loading}>
                                Submit
                                {loading && (
                                    <CircularProgress size={30} className={classes.progressSpinner}/>
                                )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Fragment>
    )
}

PostScream.propTypes = {
    postScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired, 
    UI: PropTypes.object.isRequired
}

let mapStateToProps = (state) => ({
    UI: state.ui
})

export default connect(mapStateToProps, { postScream, clearErrors }) (withStyles(styles)(PostScream));




