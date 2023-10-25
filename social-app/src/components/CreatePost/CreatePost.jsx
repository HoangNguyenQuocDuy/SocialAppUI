import classnames from 'classnames/bind'
import { useRef, useState } from 'react';

import styles from './CreatePost.module.scss'
import HeadlessIcon from '../HeadlessIcon';
import useAutosizeTextArea from '~/config/useAutosizeTextArea';
import newRequet from '~/untils/request';

const cx = classnames.bind(styles)


function CreatePost() {
    const [showIcon, setShowIcon] = useState(true)
    const [textareaValue, setTextareaValue] = useState("")
    const [imagesSelectors, setimagesSelectors] = useState([]);
    const inputFileRef = useRef();
    const [isLoading, setIsLoading] = useState(false)
    const textareaRef = useRef(null)


    useAutosizeTextArea(textareaRef.current, textareaValue)

    const handleCreatePost = async () => {
        if (!isLoading) {

            const token = localStorage.getItem('accessToken')

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
                setTextareaValue("")
                setimagesSelectors([])
                textareaRef.current.focus()
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
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        setimagesSelectors(prev => [...prev, ...response.data.data])
        setIsLoading(false)
    }

    const handleClickIcon = () => {
        inputFileRef.current.click()
    }

    const handleDeleteImageSelector = (image) => {
        setimagesSelectors(prev => prev.filter(item => item != image))
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('box-icons')}>
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
                <div className={cx('border')}></div>
            </div>
            <div className={cx('box-create')}>
                <div className={cx('input-box')}>
                    <HeadlessIcon />
                    <textarea rows={1} onChange={(e) => { setTextareaValue(e.target.value) }} value={textareaValue} ref={textareaRef} placeholder='Write your thinking...' />
                </div>
                <div>
                    <button onClick={handleCreatePost} className={cx('submit-btn', { isLoading })}>
                        Post
                        {isLoading && <i className="fa-solid fa-spinner"></i>}
                    </button>
                </div>
            </div>
            <div className={cx("img-box")}>
                {
                    imagesSelectors.map((item, idx) => (
                        <span key={idx} className={cx('img')}>
                            <img src={item.url} />
                            <i onClick={() => { handleDeleteImageSelector(item) }} className="fa-solid fa-x"></i>
                        </span>
                    ))
                }
            </div>
        </div>
    );
}

export default CreatePost;