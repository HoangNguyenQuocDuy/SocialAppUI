/* eslint-disable no-unused-vars */
import { compose, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequet from "~/untils/request";

const initialState = []

export const fetchCommentByPostId = createAsyncThunk(
    'comments/fetchCommentByPost',
    async(postId) => {
        try {
            const response = await newRequet.get(`/comments/${postId}`);
            return response.data.data;
        } catch (error) {
            console.log('Error when get comments by postId:', error);
            throw error;
        }
    }
)


export const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        resetComments: () => {
            return []
        },
        addComment: (state, action) => {
            return [action.payload, ...state]
        },
        updateComment: (state, action) => {
            const commentId = action.payload.commentId
            const comment = state.find(comment => comment.commentId === commentId)
            if (comment) {
                const updateComment = {
                    ...comment,
                    content: action.payload.content,
                    updatedAt: action.payload.updatedAt
                }

                const updateComments = state.map(comment =>
                    comment.commentId === commentId ? updateComment : comment
                )
                return [...updateComments]
            }
        },
        removeComment: (state, action) => {
            return state.filter(comment => comment.commentId !== action.payload)
        }
    },
    // eslint-disable-next-line no-unused-vars
    extraReducers: (builder) => {
        builder.addCase(fetchCommentByPostId.fulfilled, (state, action) => {
            console.log(action.payload)
            return [...action.payload]
        })
    }
})


export const { resetComments, addComment, updateComment, removeComment } = commentSlice.actions

export default commentSlice.reducer