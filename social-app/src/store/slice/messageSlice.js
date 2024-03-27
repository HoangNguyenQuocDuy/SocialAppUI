/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequet from "~/untils/request";

const initialState = []

export const fetchMessageByRoomId = createAsyncThunk(
    'messages/fetchMessageByRoomId',
    async({ roomIdActive, accessToken }) => {
        try {
            const response = await newRequet.get(`/rooms/${roomIdActive}/messages`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.log('Error when get messages by roomId:', error);
            throw error;
        }
    }
)


export const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            return [action.payload, ...state]
        },
        removeMessage: (state, action) => {
            // return state.filter(comment => comment.commentId !== action.payload)
        }
    },
    // eslint-disable-next-line no-unused-vars
    extraReducers: (builder) => {
        builder.addCase(fetchMessageByRoomId.fulfilled, (state, action) => {
            return [...action.payload]
        })
    }
})


export const {  addMessage, removeMessage } = messageSlice.actions

export default messageSlice.reducer