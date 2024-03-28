/* eslint-disable no-useless-catch */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import newRequet from "~/untils/request"

const initialState = {
    username: '',
    accessToken: '',
    refreshToken: ''
}

export const fetchLogin = createAsyncThunk(
    'account/fetchLogin',
    async ({ username, password }) => {
        const response = await newRequet.post('/auth/login', {
            username, password
        })

        return response.data.body
    }
)

export const fetchRegister = createAsyncThunk(
    'account/fetchRegister',
    async ({ username, password, email, currentName, imageUrl }) => {
        const response = await newRequet.post('/auth/register', {
            username, password, email, currentName, imageUrl
        })

        return response.data.body 
    }
)

export const fetchRefreshToken = createAsyncThunk(
    'account/fetchRefreshToken',
    async ({ refreshToken }) => {

        try {
            const response = await newRequet.post('/auth/refreshToken', {
                refreshToken
            })
            return response.data.data;
        } catch (error) {
            throw error;
        }

        // return response.data.data
    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        login: (state, action) => {
            console.log(action.payload)
            return {
                ...action.payload
            }
        },
        logout: () => {
            localStorage.removeItem('accessToken')
            return initialState
        },
        refreshToken: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchLogin.fulfilled, (state, action) => {
            return action.payload
        })
        builder.addCase(fetchRefreshToken.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export default accountSlice.reducer

export const { login, logout, refreshToken } = accountSlice.actions
