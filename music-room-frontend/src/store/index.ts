import { configureStore } from '@reduxjs/toolkit'
import adminReducer from "./slices/adminSlice"
import categoryReducer from "./slices/categorySlice"
import roomImageReducer from "./slices/roomImageSlice"
import extraImageReducer from "./slices/extraImagesSlice"
import generalReducer from "./slices/generalSlice"

export const store = configureStore({
  reducer: {
    admin : adminReducer,
    category : categoryReducer,
    roomImage : roomImageReducer,
    extraImage : extraImageReducer,
    general : generalReducer,
    
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch