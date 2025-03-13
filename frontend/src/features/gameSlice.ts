import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '../types';

const initialState: GameState = {
  level: 1,
  experience: 0,
  money: 1000,
  detection: 0,
  currentTarget: null,
  availablePrograms: ['scan', 'bruteforce', 'hack'],
  inventory: [],
  isStealthMode: false,
  playerLevel: 1,
  playerMoney: 1000,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload;
      state.playerLevel = action.payload;
    },
    addExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
      // Level up if experience threshold is reached
      const experienceNeeded = state.level * 1000;
      if (state.experience >= experienceNeeded) {
        state.level += 1;
        state.playerLevel += 1;
        state.experience -= experienceNeeded;
      }
    },
    addMoney: (state, action: PayloadAction<number>) => {
      state.money += action.payload;
      state.playerMoney += action.payload;
    },
    setDetection: (state, action: PayloadAction<number>) => {
      state.detection = action.payload;
    },
    setCurrentTarget: (state, action: PayloadAction<string | null>) => {
      state.currentTarget = action.payload;
    },
    addProgram: (state, action: PayloadAction<string>) => {
      if (!state.availablePrograms.includes(action.payload)) {
        state.availablePrograms.push(action.payload);
      }
    },
    addToInventory: (state, action: PayloadAction<string>) => {
      if (!state.inventory.includes(action.payload)) {
        state.inventory.push(action.payload);
      }
    },
    toggleStealthMode: (state) => {
      state.isStealthMode = !state.isStealthMode;
    },
  },
});

export const {
  setLevel,
  addExperience,
  addMoney,
  setDetection,
  setCurrentTarget,
  addProgram,
  addToInventory,
  toggleStealthMode,
} = gameSlice.actions;

export default gameSlice.reducer; 