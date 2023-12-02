import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { firebase_app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
export default function GoogleOAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async()=>{
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(firebase_app);

            const result = await signInWithPopup(auth, provider);
            // console.log(result); : we need 3 things, 'displayName', 'email' and 'photoUrl' to send to the backend

            const res = await fetch('api/auth/google',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            })

            const data = await res.json();
            dispatch(signInSuccess(data));
            // console.log(data);
            navigate("/");
        }
        catch(err){
            console.log('couldnt sign in using google', err);
        }
    }
  return (
    //by default the type is submit, so we don't need that action here
    <button type='button' className='bg-red-700 p-3 text-white rounded-lg cursor-pointer hover:opacity-95'
    onClick={handleGoogleClick}
    >
        CONTINUE WITH GOOGLE
    </button>
  )
}
