
import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from './EditDetails';

import ProfileSkeleton from '../../util/ProfileSkeleton';

//MUI Stuff
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import MuiLink from '@material-ui/core/Link'
import Typography from "@material-ui/core/Typography";

//Redux
import {connect} from 'react-redux';
import { logoutUser, uploadImage } from "../../redux/actions/userActions";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import EditIcon from '@material-ui/icons/Edit';

import MyButton from "../../util/MyButton";

const styles = (theme) => ({
    paper : {
        padding: 20
    }, 
    profile : {
        '& .image-wrapper' : {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute', 
                top: '80%',
                left: '70%',
            }
        }, 
        '& .profile-image': {
            width: 200, 
            height: 200, 
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center', 
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: '#00bcd4'
            }
        }, 
        '& hr' : {
            border: 'none', 
            margin: '0 0 10px 0'
        }, 
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 20px'
        }
    }
});


let Profile = (props) => {

    const { classes, user: { credentials : { handle, createdAt, imageUrl, bio, website, location }, loading, authenticated }} = props;

    let handleImageChange = (event) => {
        // select first file in the array
        const image = event.target.files[0]
        // send to server
        const formData = new FormData();
        formData.append('image', image, image.name);
        props.uploadImage(formData)
    }

    let handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click()
    }

    let handleLogout = () => {
        props.logoutUser();
    }

    let profileMarkup = !loading ? (authenticated ? (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className='image-wrapper'>
                    <img src={imageUrl} alt="Profile Image" className="profile-image" />   
                    <input type='file' id="imageInput" hidden="hidden" onChange={handleImageChange} />
                    <MyButton tip="Edit profile picture" onClick={handleEditPicture} btnClassName='button'>
                        <EditIcon color="primary"/>
                    </MyButton>
                </div>    
                <hr/>
                <div className='profile-details'>
                    <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant='h5'>
                        @{handle}
                    </MuiLink>
                    <hr/>
                    {bio && (<Typography variant='body2'>{bio}</Typography>)}
                    <hr/>
                    {location && (
                        <Fragment>
                            <LocationOn color="primary"/> <span>{location}</span>
                            <hr/>
                        </Fragment>
                    )}
                    {website && (
                        <Fragment>
                            <LinkIcon color="primary"/>
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                {' '}{website}
                            </a>
                            <hr/>
                        </Fragment>
                    )}
                    <CalendarToday color='primary'/>{' '}
                    <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                </div>
                <MyButton tip="Logout" onClick={handleLogout}>
                        <KeyboardReturn color="primary"/>
                </MyButton>
                <EditDetails/>
            </div>
        </Paper>
        
    ): (
        <Paper className={classes.paper}>
            <Typography variant='body2' align="center">
                No profile found, please login again
            </Typography>
            <div className={classes.buttons}>
                <Button variant="contained" color="primary" component={Link} to="/login">
                    Login
                </Button>
                <Button variant="contained" color="secondary" component={Link} to="/signup">
                    Sign up
                </Button>
            
            </div>
        </Paper>
    ) ) : (<ProfileSkeleton/>)

    return profileMarkup;
}

const mapActionsToProps = {
    logoutUser, uploadImage
}

Profile.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
})



export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));