import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newRequet from "~/untils/request";
import { store } from "../store";


const initialState = []

// {
//     postId: '',
//     userId: '',
//     likes: 0,
//     postImageUrls: [],
//     postDescription: '',
//     createdAt: null,
//     updatedAt: null
// }

export const fetchPostsData = createAsyncThunk(
    'posts/fetchPostsData',
    async () => {
        const userId = store.getState().user.userId

        await newRequet.get(`/posts/user/${userId}`)
        .then(data => {
            return data
        })
        .catch((err) => {
            console.log(err)
        })
    }
)

export const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducer: {
        like: (state) => {
            state.likes += 1

            return {
                ...state
            }
        },

        disLike: (state) => {
            state.likes -= 1

            return {
                ...state
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPostsData, (state, action) => {
            return action.payload
        })
    }
})

export const { like, disLike } = postSlice.actions
 
export default postSlice.reducer