
import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';
//MUI
import Dialog from "@material-ui/core/Dialog";
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
//Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';
//Redux
import {connect} from 'react-redux';
import {getScream, clearErrors } from "../../redux/actions/dataActions";


const styles = theme => ({ 
    theme,
    invisibleSeparator: {
        border: 'none',
        margin: 4
    },
    visibleSeparator: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20 
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }

})

let ScreamDialog = (props) => {
    const [open, setOpen] = useState(false)
    const [oldPath, setOldPath] = useState('')
    const [newPath, setNewPath] = useState('')

    useEffect(()=> {
        if (props.openDialog) {
            handleOpen()
        }
    }, [])

    let handleOpen = () => {

        let oldPath = window.location.pathname;

        const { userHandle, screamId } = props;
        const newPath = `/users/${userHandle}/scream/${screamId}`;

        //edge case
        if (oldPath === newPath) {
            oldPath = `/users/${userHandle}`
        }
        // change the url when open a scream 
        window.history.pushState(null, null, newPath)

        setOpen(true)
        setOldPath(oldPath)
        setNewPath(newPath)
        props.getScream(props.screamId)
    }

    let handleClose = () => {
        // change back to old path
        window.history.pushState(null, null, oldPath)

        setOpen(false)
        props.clearErrors();
    }

    const { 
        classes,
        scream: {
            screamId,
            body,
            createdAt,
            likeCount,
            commentCount,
            userImage,
            userHandle,
            comments
            }, 
        UI: { loading }
    } = props;

    let dialogMarkup = loading ? (
        <div className={classes.spinnerDiv}> 
            <CircularProgress size={200} thickness={2}/>
        </div>
        
    ) : (
        <Grid container spacing={16}>
            <Grid item sm={5}>
                <img src={userImage} alt="Profile" className={classes.profileImage} />
            </Grid>
            <Grid item sm={7}>
                <Typography component={Link} color='primary' variants="h5" to={`@/users/${userHandle}`}>
                    @{userHandle}
                </Typography>
                <hr className={classes.invisibleSeparator}/>
                <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                </Typography>
                <hr className={classes.invisibleSeparator}/>
                <Typography variant='body1'>
                    {body}
                </Typography>
                <LikeButton screamId={screamId} />
                <span>{likeCount} likes</span>
                <MyButton tip="Comments">
                    <ChatIcon color="primary"/>
                </MyButton>
                <span>{commentCount} comments</span>
            </Grid>
            <hr className={classes.visibleSeparator}/>
            <CommentForm screamId={screamId} />
            <Comments comments={comments}/>
        </Grid>
    )

    return (
        <Fragment>
            <MyButton onClick={handleOpen} tip="Expand Scream" tipClassName={classes.expandButton}>
                <UnfoldMore color='primary' />
            </MyButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
                <MyButton tip="Close" onClick={handleClose} tipClassName={classes.closeButton}>
                    <CloseIcon/>
                </MyButton>
                <DialogContent className={classes.dialogContent}>
                    {dialogMarkup}
                </DialogContent>
            </Dialog>
        </Fragment>
    )
}

ScreamDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getScream: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    scream: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
    scream: state.data.scream,
    UI: state.ui
})

const mapActionsToProps = {
    getScream, clearErrors
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog))







