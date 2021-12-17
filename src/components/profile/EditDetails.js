
import React, { Fragment, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";

//Redux
import {connect} from 'react-redux';
import { editUserDetails } from "../../redux/actions/userActions";

// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from "@material-ui/core/DialogTitle";

//Icons
import EditIcon from '@material-ui/icons/Edit';

import MyButton from "../../util/MyButton";

const styles = (theme) => ({
    
    button: {
        float: 'right'
    }
})


let EditDetails = (props) => {

    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState('')
    const [open, setOpen] = useState(false)

    const { classes } = props;

    useEffect(()=> {
        const { credentials } = props;
        //mapUserDetailsToState(credentials)

    }, [props.credentials])

    let handleOpen = () => {
        setOpen(true)
        mapUserDetailsToState(props.credentials)
    }

    let handleClose = () => {
        setOpen(false);
    }

    let mapUserDetailsToState = (credentials) => {
        if (credentials.bio){
            setBio(credentials.bio)
        }
        if (credentials.website){
            setWebsite(credentials.website)
        }
        if (credentials.location){
            setLocation(credentials.location)
        }
    }

    let handleChange = (event) => {
        if (event.target.name === 'bio'){
            setBio(event.target.value)
        } else if (event.target.name === 'website'){
            setWebsite(event.target.value)
        } else if (event.target.name === 'location'){
            setLocation(event.target.value)
        };
    }
    
    let handleSubmit = ()=> {
        const userDetails = {
            bio: bio,
            website: website, 
            location: location
        }
        props.editUserDetails(userDetails)
        handleClose()
    }

    return (
        <Fragment>
            <MyButton tip="Edit details" onClick={handleOpen} btnClassName={classes.button}>
                <EditIcon color="primary"/>
            </MyButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit your details</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField 
                            name="bio"
                            type="text"
                            label="Bio"
                            multiline 
                            rows="3"
                            placeholder="A short bio about yourself"
                            className={classes.textField}
                            value={bio}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField 
                            name="website"
                            type="text"
                            label="Website"
                            placeholder="Your personal/professional website"
                            className={classes.textField}
                            value={website}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField 
                            name="location"
                            type="text"
                            label="Location"
                            placeholder="Where you live"
                            className={classes.textField}
                            value={location}
                            onChange={handleChange}
                            fullWidth
                        />

                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSubmit} color='primary'>Save</Button>

                </DialogActions>
            </Dialog>
        </Fragment>
    )

}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
})

export default connect(mapStateToProps, { editUserDetails })(withStyles(styles)(EditDetails));


