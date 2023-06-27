import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './reducers/AuthReducer';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {}
};

const persistedState = loadState();

const store = configureStore({
    preloadedState: persistedState,
    reducer: {
      auth: AuthReducer,
    }
})

store.subscribe(() => {
  saveState(store.getState());
});

export default store;