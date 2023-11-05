import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: 'light',
    isOpenGallery: false,
    galleryImgs: [],
    settingSlide: {
        infinite: "true",
        speed: 500,
        slidetoshow: 1,
        slidestoscroll: 1,
        initialSlide: 0
    }

}


export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleOpenGallery: (state) => {
            return {
                ...state,
                isOpenGallery: !state.isOpenGallery
            }
        },
        handleOpenGalleryByAction: (state, action) => {
            return {
                ...state,
                isOpenGallery: action.payload
            }
        },
        toggleTheme: (state) => {
            return {
                ...state,
                theme: state.theme === 'light' ? 'dark' : 'light'
            }
        },
        setImgShowSlider: (state, action) => {
            const newSetting = {
                ...state.settingSlide,
                initialSlide: action.payload
            }
            return { ...state, settingSlide: { ...newSetting } }
        },
        setGalleryImgs: (state, action) => {
            return {
                ...state,
                galleryImgs: action.payload
            }
        }

    },
    extraReducers:(builder) => {

    }
})

export default appSlice.reducer

export const { toggleOpenGallery, handleOpenGalleryByAction, 
    toggleTheme, addImgToGallerry, setImgShowSlider, setGalleryImgs } 
    = appSlice.actions
