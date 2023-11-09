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
    },
    isOpenConfirmBox: false,
    isShowPostTippy: false,
    postIdWillBeDeleted: null,
    isShowAnnounce: false,

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
        },
        setIsOpenConfirmBox: (state, action) => {
            return {
                ...state,
                isOpenConfirmBox: action.payload
            }
        },
        setIsShowPostTippy: (state, action) => {
            return {
                ...state,
                isShowPostTippy: action.payload
            }
        },
        setPostIdWillBeDeleted: (state, action) => {
            return {
                ...state,
                postIdWillBeDeleted: action.payload
            }
        },
        setIsShowAnnounce: (state, action) => {
            return {
                ...state,
                isShowAnnounce: action.payload
            }
        }
    },
    // eslint-disable-next-line no-unused-vars
    extraReducers:(builder) => {

    }
})

export default appSlice.reducer

export const { toggleOpenGallery, handleOpenGalleryByAction, 
    toggleTheme, addImgToGallerry, setImgShowSlider, setGalleryImgs, setIsOpenConfirmBox,
    setIsShowPostTippy, setPostIdWillBeDeleted, setIsShowAnnounce } 
    = appSlice.actions
