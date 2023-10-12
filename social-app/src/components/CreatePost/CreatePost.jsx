import classnames from 'classnames/bind'
import { useRef, useState } from 'react';

import styles from './CreatePost.module.scss'
import HeadlessIcon from '../HeadlessIcon';
import useAutosizeTextArea from '~/config/useAutosizeTextArea';

const cx = classnames.bind(styles)


function CreatePost() {
    const [showIcon, setShowIcon] = useState(true)
    const [textareaValue, setTextareaValue] = useState("")
    const textareaRef = useRef(null)

    useAutosizeTextArea(textareaRef.current, textareaValue)

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
                    <span className={cx({ hide: !showIcon })}>
                        <i className='isax-image1'></i>
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
                <button className={cx('submit-btn')}>Post</button>
            </div>
        </div>
    );
}

export default CreatePost;