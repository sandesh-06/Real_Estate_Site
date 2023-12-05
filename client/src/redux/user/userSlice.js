import { createSlice } from "@reduxjs/toolkit";

const initialState = { //just like how you have initial state in useState
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        signInStart: (state)=>{ //just like how we have a function to handleSubmit in signIn, where we set loading true, and fetch data
            state.loading=true
        },
        signInSuccess: (state, action)=>{
            state.currentUser = action.payload; //this is action for getting data from database
            state.loading = false;
            state.error = null; //maybe we had error for prev attempt, so now set it to null
        },
        signInFailure: (state, action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        //for update user functionality
        updateUserStart: (state)=>{ 
            state.loading=true
        },
        updateUserSuccess: (state, action)=>{
            state.currentUser = action.payload; 
            state.loading = false;
            state.error = null; 
        }, 
        updateUserFailure: (state, action)=>{
            state.error = action.payload;
            state.loading = false;
        },
    }
})

export const {signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserStart, updateUserSuccess} = userSlice.actions;

export default userSlice.reducer;