import classnames from 'classnames/bind'
import { useEffect, useRef, useState } from 'react';

import styles from './CreatePost.module.scss'
import useAutosizeTextArea from '~/config/useAutosizeTextArea';
import newRequet from '~/untils/request';
import HeadlessIcon from '../HeadlessIcon';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShowAnnounce, setIsShowCancelBox, setIsUpdatingPost, setMessageAnnounce, setPostWillBeUpdated } from '~/store/slice/appSlice';
import { updatePost } from '~/store/slice/postSlice';

const cx = classnames.bind(styles)


function CreatePost() {
    const [showIcon, setShowIcon] = useState(true)
    const [textareaValue, setTextareaValue] = useState("")
    const [imagesSelectors, setimagesSelectors] = useState([]);
    const inputFileRef = useRef();
    const [isLoading, setIsLoading] = useState(false)
    const textareaRef = useRef(null)
    const dispatch = useDispatch()
    const token = localStorage.getItem('accessToken')
    const messageUpdatePostSuccessful = 'This post is updating ...'

    const { isUpdatingPost, postWillBeUpdated } = useSelector(state => state.app)

    // const [updating, setUpdating]

    useAutosizeTextArea(textareaRef.current, textareaValue)

    const handleInitCreatePost = () => {
        setTextareaValue("")
        setimagesSelectors([])
        textareaRef.current.focus()
    }

    const handleCreatePost = async () => {
        if (!isLoading) {
            const imgUrls = imagesSelectors.map(img => img.url)

            await newRequet.post(
                '/posts/save',
                {
                    postImageUrls: imgUrls,
                    postDescription: textareaValue
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            ).then(data => {
                handleInitCreatePost()
                console.log(data)
            })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const handleInputFiles = async (e) => {
        const imgs = e.target.files

        const formData = new FormData()

        for (let i = 0; i < imgs.length; i++) {
            formData.append("images", imgs[i])
        }

        setIsLoading(true)
        const response = await newRequet.post(
            '/cloudinary/uploadMultipleFiles',
            formData, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        setimagesSelectors(prev => [...prev, ...response.data.data])
        setIsLoading(false)
    }

    const handleCancelUpdatePost = () => {
        dispatch(setIsShowCancelBox(true))
    }

    const handleClickIcon = () => {
        inputFileRef.current.click()
    }

    const handleDeleteImageSelector = (image) => {
        setimagesSelectors(prev => prev.filter(item => item != image))
    }

    useEffect(() => {

        if (!isUpdatingPost) {
            handleInitCreatePost()
        }
        
        if (isUpdatingPost && postWillBeUpdated && postWillBeUpdated.postImageUrls.length > 0) {
            setimagesSelectors(postWillBeUpdated.postImageUrls)
            setTextareaValue(postWillBeUpdated.postDescription)
            textareaRef.current.focus()
        }
    }, [postWillBeUpdated, isUpdatingPost])

    const handleUpdatePost = async () => {
        const imgUrls = imagesSelectors.map(img => {
            return img.url ? img.url : img
        })

        setIsLoading(true)
        await newRequet.put(`/posts/update/${postWillBeUpdated.postId}`,
            {
                postImageUrls: imgUrls,
                postDescription: textareaValue
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            .then(data => {
                dispatch(setIsShowAnnounce(true))
                dispatch(setMessageAnnounce(messageUpdatePostSuccessful))
                
                setTimeout(() => {
                    dispatch(setPostWillBeUpdated(null))
                    dispatch(setIsUpdatingPost(false))
                    dispatch(updatePost(data.data.data))
                    handleInitCreatePost()
                    setIsLoading(false)
                }, 3000)
            })
            .catch(err => {
                console.log('ERR when update posst', err)
            })
    }

    const handleClickMainButton = () => {
        if (isUpdatingPost) {
            handleUpdatePost()
        } else {
            handleCreatePost()

        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('box-icons')}>
                <div className={cx('wrapper-flex')}>
                    <div className={cx('icons')}>
                        <span onClick={() => { setShowIcon(!showIcon) }} className={cx('plus-icon', { active: showIcon })}>
                            <i className="fa-solid fa-plus"></i>
                        </span>
                        <span className={cx({ hide: !showIcon })}>
                            <i className='isax-link-211'></i>
                        </span>
                        <span onClick={handleClickIcon} className={cx({ hide: !showIcon })}>
                            <i className='isax-image1'></i>
                            <input multiple accept='image/*' ref={inputFileRef} type="file" onChange={(e) => { handleInputFiles(e) }} />
                        </span>
                        <span className={cx({ hide: !showIcon })}>
                            <i className="fa-solid fa-list"></i>
                        </span>
                        <span className={cx({ hide: !showIcon })}>
                            <i className='isax-camera1'></i>
                        </span>
                    </div>
                    {isUpdatingPost && <div>
                        <button onClick={handleCancelUpdatePost} className={cx('cancel-btn', { prevent: isLoading })}>
                            Cancel
                        </button>
                    </div>}
                </div>
                <div className={cx('border')}></div>
            </div>
            <div className={cx('box-create')}>
                <div className={cx('input-box')}>
                    <HeadlessIcon />
                    <textarea rows={1} onChange={(e) => { setTextareaValue(e.target.value) }} value={textareaValue} ref={textareaRef} placeholder='Write your thinking...' />
                </div>
                <div>
                    <button onClick={handleClickMainButton} className={cx('submit-btn', { isLoading })}>
                        {isUpdatingPost ? 'Update' : 'Post'}
                        {isLoading && <i className="fa-solid fa-spinner"></i>}
                    </button>
                </div>
            </div>
            <div className={cx("img-box")}>
                {

                    imagesSelectors.map((item, idx) => (
                        <span key={idx} className={cx('img')}>
                            {item.url ? <img src={item.url} /> : <img src={item} />}
                            <i onClick={() => { handleDeleteImageSelector(item) }} className="fa-solid fa-x"></i>
                        </span>
                    ))
                }
            </div>
        </div>
    );
}

export default CreatePost;