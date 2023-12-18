import { createStore } from 'redux'
import { rootReducer } from './state/RootReducer'
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  // middleware: [thunk],
});

// const store = createStore(changeState)
export default store
