
import React, {Fragment, useState} from "react";
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

// MUI
import withStyles from "@material-ui/styles/withStyles";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

//Icons
import DeleteOutline from '@material-ui/icons/DeleteOutline';

// Redux
import { connect } from 'react-redux';
import { deleteScream } from '../../redux/actions/dataActions'


const styles = {
    deleteButton: {
        left: '90%',
        position: 'absolute',
        top: '9%'
        
    }
}

let DeleteScream = (props) => {

    const [open, setOpen] = useState(false)
    const { classes } = props;

    let handleOpen = () => {
        setOpen(true)
    }

    let handleClose = () => {
        setOpen(false)
    }   

    let deleteScream = () => {
        props.deleteScream(props.screamId)
        setOpen(false)
    }

    return (
        <Fragment>
            <MyButton tip="Delete Scream" onClick={handleOpen} btnClassName={classes.deleteButton}>
                <DeleteOutline color="secondary"/>
            </MyButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Are you sure you want to delete this scream?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>Cancel</Button>
                    <Button onClick={deleteScream} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )

}

DeleteScream.propTypes = {
    deleteScream: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired
}

export default connect(null, { deleteScream })(withStyles(styles)(DeleteScream));