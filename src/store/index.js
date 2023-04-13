import { configureStore } from '@reduxjs/toolkit';
import kodiApi from 'services/kodi-api';

export const store = configureStore({
  reducer: {
    [kodiApi.reducerPath]: kodiApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(kodiApi.middleware),
});
