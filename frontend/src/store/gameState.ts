import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Program, Target, GameState } from '../types';

const initialState: GameState = {
  playerLevel: 1,
  playerXP: 0,
  playerMoney: 500,
  detectionLevel: 0,
  stealthMode: false,
  activePrograms: [],
  currentTarget: null,
  inventory: ['BruteX Basic'],
  discoveredVulnerabilities: [],
  isProcessing: false,
  prompt: 'root@k4l1:~#'
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGameState: (state, action: PayloadAction<Partial<GameState>>) => {
      return { ...state, ...action.payload };
    },
    setTarget: (state, action: PayloadAction<Target | null>) => {
      state.currentTarget = action.payload;
      state.detectionLevel = 0;
      state.discoveredVulnerabilities = [];
    },
    addProgram: (state, action: PayloadAction<Program>) => {
      if (!state.inventory.includes(action.payload.name)) {
        state.inventory.push(action.payload.name);
      }
    },
    increaseDetection: (state, action: PayloadAction<number>) => {
      const increase = state.stealthMode ? action.payload * 0.5 : action.payload;
      state.detectionLevel = Math.min(100, state.detectionLevel + increase);
    },
    toggleStealth: (state) => {
      state.stealthMode = !state.stealthMode;
    },
    addReward: (state, action: PayloadAction<{ xp: number; money: number }>) => {
      state.playerXP += action.payload.xp;
      state.playerMoney += action.payload.money;
      
      // Level up if enough XP
      if (state.playerXP >= 100 * state.playerLevel) {
        state.playerLevel++;
        state.playerXP = 0;
      }
    }
  }
});

export const {
  updateGameState,
  setTarget,
  addProgram,
  increaseDetection,
  toggleStealth,
  addReward
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;

// Custom hook for accessing game state
export const useGameState = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);

  return {
    gameState,
    updateGameState: (update: Partial<GameState>) => dispatch(updateGameState(update)),
    setTarget: (target: Target | null) => dispatch(setTarget(target)),
    addProgram: (program: Program) => dispatch(addProgram(program)),
    increaseDetection: (amount: number) => dispatch(increaseDetection(amount)),
    toggleStealth: () => dispatch(toggleStealth()),
    addReward: (reward: { xp: number; money: number }) => dispatch(addReward(reward))
  };
}; 