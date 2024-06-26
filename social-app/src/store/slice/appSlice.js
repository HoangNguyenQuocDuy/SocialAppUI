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
    isUpdatingPost: false,
    isShowCancelBox: false,
    postWillBeUpdated: null,
    messageAnnounce: '',
    isOpenCommentBox: false,
    postComment: null,
    commentIdIsUpdating: '',
    commentIdWillBeDeleted: '',
    roomIdActive: '',
    userSettingVisible: false,
    userAddRoomVisible: false,
    userRoomOptionActive: '',
    userAddUserToRoom: false,
    emailResetPassword: '',

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
        },
        setIsUpdatingPost: (state, action) => {
            return {
                ...state,
                isUpdatingPost: action.payload
            }
        },
        setPostWillBeUpdated: (state, action) => {

            return {
                ...state,
                postWillBeUpdated: { ...action.payload }
            }
        },
        setIsShowCancelBox: (state, action) => {
            return {
                ...state,
                isShowCancelBox: action.payload
            }
        },
        setMessageAnnounce: (state, action) => {
            return {
                ...state,
                messageAnnounce: action.payload
            }
        },
        setIsOpenCommentBox: (state, action) => {
            return {
                ...state,
                isOpenCommentBox: action.payload
            }
        },
        setPostComment: (state, action) => {
            return {
                ...state,
                postComment: { ...action.payload }
            }
        },
        setCommentIdIsUpdating: (state, action) => {
            return {
                ...state,
                commentIdIsUpdating: action.payload
            }
        },
        setCommentIdWillBeDeleted: (state, action) => {
            return {
                ...state,
                commentIdWillBeDeleted: action.payload
            }
        },
        setRoomIdActive: (state, action) => {
            return {
                ...state,
                roomIdActive: action.payload
            }
        },
        setUserSettingVisible: (state, action) => {
            return {
                ...state,
                userSettingVisible: action.payload
            }
        },
        setTheme: (state, action) => {
            return {
                ...state,
                theme: action.payload
            }
        },
        setUserAddRoomVisible: (state, action) => {
            return {
                ...state,
                userAddRoomVisible: action.payload
            }
        },
        setUserRoomOptionActive: (state, action) => {
            return {
                ...state,
                userRoomOptionActive: action.payload
            }
        },
        setUserAddUserToRoom: (state, action) => {
            return {
                ...state, 
                userAddUserToRoom: action.payload
            }
        },
        setEmailResetPassword: (state, action) => {
            return {
                ...state,
                emailResetPassword: action.payload
            }
        }
    },
    // eslint-disable-next-line no-unused-vars
    extraReducers: (builder) => {

    }
})

export default appSlice.reducer

export const { toggleOpenGallery, handleOpenGalleryByAction,
    toggleTheme, addImgToGallerry, setImgShowSlider, setGalleryImgs, setIsOpenConfirmBox,
    setIsShowPostTippy, setPostIdWillBeDeleted, setIsShowAnnounce, setRoomIdActive,
    setIsUpdatingPost, setPostWillBeUpdated, setIsShowCancelBox, setMessageAnnounce,
    setIsOpenCommentBox, setPostComment, setCommentIdIsUpdating, setCommentIdWillBeDeleted,
    setUserSettingVisible, setTheme, setUserAddRoomVisible, setUserRoomOptionActive,
    setUserAddUserToRoom, setEmailResetPassword }
    = appSlice.actions
