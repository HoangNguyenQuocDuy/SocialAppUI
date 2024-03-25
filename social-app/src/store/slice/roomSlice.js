/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequet from "~/untils/request";

const initialState = []

export const fetchRoomByUserId = createAsyncThunk(
    'rooms/fetchRoomByUserId',
    async(token) => {
        try {
            const response = await newRequet.get(`/rooms/`, { 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.log('Error when get rooms by userId:', error);
            throw error;
        }
    }
)


export const roomSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        addRoom: (state, action) => {
            return [action.payload, ...state]
        },
        removeRoom: (state, action) => {
            // return state.filter(comment => comment.commentId !== action.payload)
        }
    },
    // eslint-disable-next-line no-unused-vars
    extraReducers: (builder) => {
        builder.addCase(fetchRoomByUserId.fulfilled, (state, action) => {
            console.log(action.payload)
            return action.payload
        })
    }
})


export const {  addRoom, removeRoom } = roomSlice.actions

export default roomSlice.reducer