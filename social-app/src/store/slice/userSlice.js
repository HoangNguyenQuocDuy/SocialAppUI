import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequet from "~/untils/request";

const initialState = {
    userId: '',
    username: '',
    currentName: '',
    email: '',
    imageUrl: ''
}

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (username) => {
        const response = await newRequet.get(`/users/username/${username}`)
        
        return response.data
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            state.userId = action.payload.data.userId
            state.email = action.payload.data.email
            state.imageUrl = action.payload.data.imageUrl
            state.username = action.payload.data.username
            state.currentName = action.payload.data.currentName
        })
    }
})

export default userSlice.reducer