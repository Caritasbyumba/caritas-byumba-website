import { configureStore } from '@reduxjs/toolkit';
import { adminApiSlice } from '../Features/API/admin-api-slice';
import { userApiSlice } from '../Features/API/user-api-slice';
import globalReducer from '../Features/Global/global-slice';

export const store = configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    global: globalReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([
      userApiSlice.middleware,
      adminApiSlice.middleware,
    ]);
  },
});
