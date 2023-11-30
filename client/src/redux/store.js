import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import userReducer from './user/userSlice'

export const store = configureStore({
    reducer: {
        user: userReducer
    },
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck: false,
    }), //to not get an error for not serializing variables

})