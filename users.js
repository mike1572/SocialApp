
const { admin, db } = require('../util/admin')


const firebase = require('firebase')
const config = require('../util/config')

firebase.initializeApp(config)

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators')


// signup user
exports.signup = (request, response)=> {
    
    const newUser = {
        email: request.body.email, 
        password: request.body.password, 
        confirmPassword: request.body.confirmPassword, 
        handle: request.body.handle, 
    }
    
    const { valid, errors } = validateSignupData(newUser);
        
    if (!valid){
        return response.status(400).json(errors)
    }

    const noImg = 'no-img.png';

    // Validate Data
    let token, userId;

    // if handle already taken, error
    db.doc(`/users/${newUser.handle}`).get()
    .then((doc)=> {
        if (doc.exists){
            return response.status(400).json({handle: 'This handle is already taken'})
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    }).then((data)=> {
        userId = data.user.uid;
        return data.user.getIdToken()
    }).then((idToken)=> {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle, 
            email: newUser.email, 
            createdAt: new Date().toISOString(), 
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            userId: userId
        }

        return db.doc(`/users/${newUser.handle}`).set(userCredentials)

        //return response.status(201).json({token})
    }).then(()=> {
        return response.status(201).json({token})

    }).catch((err)=> {
        console.error(err)
        if (err.code === "auth/email-already-in-use"){
            return response.status(400).json({ email: 'Email is already used'})
        } else {
            return response.status(500).json({ general: "Something went wrong, please try again"})
        }
        
    })

}

// login user
exports.login = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }


    const { valid, errors } = validateLoginData(user);
        
    if (!valid){
        return response.status(400).json(errors)
    }

    

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then((data)=> {
        return data.user.getIdToken()
    })
    .then((token)=> {
        return response.json({token})
    })
    .catch((err)=> {
        console.error(err)
        //'auth/wrong-password
        //'auth/user-not-found
        //'auth/too-many-requests'
        if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'){
            return response.status(403).json({general: 'Wrong credentials, please try again'})
        } else if (err.code === 'auth/invalid-email'){
            return response.status(403).json({email: 'Invalid email'})
        }
        else if (err.code === 'auth/too-many-requests'){
            return response.status(403).json({general: 'There has been too many login failures. Try again later'})
        }
        else {
            return response.status(500).json({error: err.code})
        }
       
    })

}

// Add User Details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    // if any elements in userDetails, they are simply added by firebase to the document of user
    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(()=> {
        return res.json({ message: 'Details added successfully'})
    })
    .catch((err)=> {
        console.error(err)
        return res.status(500).json({error: err.code})
    })

}

// get any user's details
exports.getUserDetails = (req, res) => {
    let userData = {}
    db.doc(`/users/${req.params.handle}`).get()
        .then((doc)=> {
            if (doc.exists){
                userData.user = doc.data();
                return db.collection('screams').where('userHandle', "==", req.params.handle).orderBy('createdAt', 'desc').get();
            } else {
                return res.status(404).json({error: "User not found"})
            }
        })
        .then((data)=> {
            userData.screams = [];
            data.forEach((doc)=> {
                userData.screams.push({
                    body: doc.data().body, 
                    createdAt: doc.data().createdAt, 
                    userHandle: doc.data().userHandle, 
                    userImage: doc.data().userImage, 
                    likeCount: doc.data().likeCount, 
                    commentCount: doc.data().commentCount, 
                    screamId: doc.id

                })
            })
            return res.json(userData)
        })
        .catch((err)=> {
            console.error(err)
            return res.status(500).json({error: err.code})
        })
}


// get own user details
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc)=> {
        if (doc.exists){
            userData.credentials = doc.data();
            return db.collection('likes').where('userHandle', '==', req.user.handle).get();
        }
    })
    .then((data)=> {
        userData.likes = []
        data.forEach((doc)=> {
            userData.likes.push(doc.data())
        })
        return db.collection('notifications').where('recipient', '==', req.user.handle).orderBy('createdAt', 'desc').limit(10).get()
    })
    .then((data)=> {
        userData.notifications = []
        data.forEach((doc)=> {
            userData.notifications.push({
                recipient: doc.data().recipient, 
                sender: doc.data().sender, 
                createdAt: doc.data().createdAt, 
                screamId: doc.data().screamId, 
                type: doc.data().type, 
                read: doc.data().read,
                notificationId: doc.id

            })
        })
        return res.json(userData)
    })
    .catch((err)=> {
        console.error(err)
        return res.status(500).json({error: err.code})
    })
}


// upload a profile image
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path')
    const os = require('os')
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers })

    let imageFileName;
    let imageToBeUploaded= {}

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        
        // make sure user is not uploading text files, gifs...
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({
                error: "Wrong file type submitted"
            })
        }
        // image.png :need to get the png or jpeg in some case
        const imageExtension = filename.split('.')[filename.split('.').length -1]
        // ex: 3435642145.png
        imageFileName = `${Math.round(Math.random() * 10000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);

        imageToBeUploaded = { filepath, mimetype }

        file.pipe(fs.createWriteStream(filepath))

    })

    busboy.on('finish', ()=> {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false, 
            metadata: {
                contentType: imageToBeUploaded.mimetype
            }
        })  
        .then(()=> {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({imageUrl})
        })
        .then(()=> {
            return res.json({ message: 'Image uploaded successfully'})
        })
        .catch((err)=> {
            console.error(err)
            return res.status(500).json({ error: err.code });
        })
    })
    busboy.end(req.rawBody)
}

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach((notificationId)=> {
        const notification = db.doc(`/notifications/${notificationId}`)
        batch.update(notification, { read: true });
    })
    batch.commit()
    .then(()=> {
        return res.json({ message: 'Notifications marked read'})
    })
    .catch((err)=> {
        console.error(err)
        return res.status(500).json({err})
    })
}












