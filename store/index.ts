import { configureStore } from '@reduxjs/toolkit';
import { healthApi } from '../api/healthApi';
import { recipeApi } from '../api/recipeApi';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [recipeApi.reducerPath]: recipeApi.reducer,
    [healthApi.reducerPath]: healthApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recipeApi.middleware, healthApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
