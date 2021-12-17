
import React from "react";
import PropTypes from 'prop-types';
import NoImg from '../images/no-image.png';
import withStyles from '@material-ui/core/styles/withStyles';

//MUI
import Paper from '@material-ui/core/Paper';

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

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
    },
    handle: {
        height: 20,
        backgroundColor: '#00bcd4',
        width: 60,
        margin: '0 auto 7px auto' 
    },
    fullLine : {
        height: 15,
        backgroundColor: 'rgba(0,0,0, 0.6)',
        width: '100%',
        marginBottom: 10
    },
    halfLine : {
        height: 15,
        backgroundColor: 'rgba(0,0,0, 0.6)',
        width: '50%',
        marginBottom: 10
    }
});


let ProfileSkeleton = (props) => {
    const {classes} = props;

    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className='image-wrapper'>
                    <img src={NoImg} alt="Profile" className="profile-image"/>
                </div>
                <hr/>
                <div className="profile-details">
                    <div className={classes.handle}/>
                    <hr/>
                    <div className={classes.fullLine}/>
                    <div className={classes.fullLine}/>
                    <hr/>
                    <LocationOn color="primary"/> <span>Location</span>
                    <hr/>
                    <LinkIcon color="primary"/> <span>https://website.com</span>
                    <hr/>
                    <CalendarToday color="primary"/> <span>Joined date</span>
                </div>        
            </div>
        </Paper>

    )
}

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProfileSkeleton);











