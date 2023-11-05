import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequet from "~/untils/request";


const initialState = [
]

export const fetchPostsData = createAsyncThunk(
    'posts/fetchPostsData',
    // eslint-disable-next-line no-unused-vars
    async (page) => {
        try {
            // /posts/?page=${page}&size=${2}
            const response = await newRequet.get(`/posts/`);
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
            const postId = action.payload.postId
            const post = state.find(post => post.postId === postId)
            console.log(post)

            if (post) {
                const updatePost = {
                    ...post,
                    likes: post.likes+1
                }

                const updatePosts = state.map(post =>
                    post.postId === postId ? updatePost : post
                )
                return [...updatePosts]
            }

            return state
        },

        disLike: (state, action) => {
            const postId = action.payload.postId
            const post = state.find(post => post.postId === postId)

            if (post) {
                const updatePost = {
                    ...post,
                    likes: post.likes-1
                }

                const updatePosts = state.map(post =>
                    post.postId === postId ? updatePost : post
                )
                return [...updatePosts]
            }

            return state
        },
        resetPosts: () => {
            return []
        },
        deletePost: (state, action) => {
            return state.filter(post => post.postId !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPostsData.fulfilled, (state, action) => {
            return [...state, ...action.payload]
        })
        // builder.addCase(deletePost.fulfilled, (state, action) => {
        //         // return state.filter(post => post.postId !== action.payload.postId)
        // }),
    }
})

export const { like, disLike, resetPosts, deletePost } = postSlice.actions

export default postSlice.reducer