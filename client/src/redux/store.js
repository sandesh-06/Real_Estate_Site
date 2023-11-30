import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import {persistReducer, persistStore} from 'redux-persist' //the user: state will be gone, when the page is refreshed. To avoid that we need redux-persist
import storage from 'redux-persist/lib/storage'


const rootReducer = combineReducers({
    user: userReducer,
}) //combines all reducers

const persistConfig={
    key: 'root',
    storage,
    version: 1,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
   reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck: false,
    }), //to not get an error for not serializing variables

})

export const persistor = persistStore(store);

/*


Certainly! This code snippet sets up a Redux store with the ability to persist its state using redux-persist. Let's break down the key parts:

Reducers Combination:
const rootReducer = combineReducers({
    user: userReducer,
})
Here, combineReducers from Redux is used to combine multiple reducers into a single root reducer. In this case, it combines the userReducer which handles actions related to the 'user' slice of the store.


Redux Persist Configuration:
const persistConfig={
    key: 'root',
    storage,
    version: 1,
}
The persistConfig object specifies the configuration for persisting the Redux store's state. It includes a key to identify the persisted state, storage (in this case, redux-persist uses storage from redux-persist/lib/storage), and a version for the persisted state.


Persisted Reducer:
const persistedReducer = persistReducer(persistConfig, rootReducer)
persistReducer is used to wrap the root reducer with the persist configuration, creating a new persisted reducer.


Redux Store Configuration:
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck: false,
    }),
})
configureStore from @reduxjs/toolkit is used to create the Redux store.
The reducer property is set to the persistedReducer, which includes the combined reducers and the persist configuration.
getDefaultMiddleware is used with custom settings (serializableCheck: false) to avoid serialization checks on action payloads.


Persistor:
export const persistor = persistStore(store);
persistStore is used to create a persistor, which is responsible for persisting and rehydrating the Redux store's state.

This setup integrates redux-persist with Redux, allowing the store's state to be saved to storage and reloaded when the application restarts or refreshes, helping to maintain the state across sessions or page reloads.
*/