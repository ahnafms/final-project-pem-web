import { signInWithEmailAndPassword } from 'firebase/auth'
import admin from '../firebase/firebase-admin.js'
import { auth } from '../firebase/firebase.js'


export const register = async (user) => {
    //create account
    try {
        const _res = await admin.auth().createUser({
            ...user,
            displayName : user.displayname
        })
        return {
            email : _res.email
        }
    } catch (err) {
        let httpException = new Error(err.message)
        httpException.stack = 400
        throw httpException
    }
}

export const login = async (user) => {
    try {
        const _token = await firebaseLogin(user);
        return _token;
    } catch (err) {
        let httpException = new Error(err.message)
        httpException.stack = 400
        throw httpException
    }
}


export const verifyToken = async (req) => {
    try {
        const userId = await admin.auth().verifyIdToken(req.token).then((res) => {
            return res.uid
        })
        const userData = await admin.auth().getUser(userId).then((res) => res)
        if(userData)
            return {
                username : userData.displayName
            }
    } catch (err) { 
        let httpException = new Error(err.message)
        httpException.stack = 400
        throw httpException
    }
}


 
const firebaseLogin = async (user) => {
    try {
        const token = await signInWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
            return res.user.getIdToken()
        })
        .then(token => {
            return token
        })
        return token;
    } catch (err){
        let httpException = new Error(err.message)
        httpException.stack = 400
        throw httpException
    }
}  