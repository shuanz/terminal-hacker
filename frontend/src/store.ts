import { configureStore } from '@reduxjs/toolkit';
import terminalReducer from './features/terminalSlice';

export const store = configureStore({
  reducer: {
    terminal: terminalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 