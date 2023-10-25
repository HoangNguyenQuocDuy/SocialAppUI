import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequet from "~/untils/request";


const initialState = [
]

export const fetchPostsData = createAsyncThunk(
    'posts/fetchPostsData',
    async (page) => {
        try {

            const response = await newRequet.get(`/posts/?page=${page + 1}&size=${2}`);
            return response.data.data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
)

export const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        like: (state, action) => {
            const postId = action.payload
            const post = state.find(post => post.id === postId)

            if (post) {
                post.likes++
            }
        },

        disLike: (state, action) => {
            const postId = action.payload
            const post = state.find(post => post.id === postId)

            if (post && post.likes > 0) {
                post.likes--
            }
        },
        resetPosts: () => {
            return []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPostsData.fulfilled, (state, action) => {
            // console.log('action from fetch: ', action)
            // const newPosts = action.payload.filter(
            //     post => state.some(exittingPost => {
            //         console.log('exittingPost: ', exittingPost)
            //         console.log('post: ', post)
            //         if (exittingPost.postId !== post.postId)
            //             return post
            //     })
            // )
            console.log('newPosts: ', action.payload)
            return [...state, ...action.payload]
        })
    }
})

export const { like, disLike, resetPosts } = postSlice.actions

export default postSlice.reducer