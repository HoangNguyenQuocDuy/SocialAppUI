import classnames from 'classnames/bind'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'

import styles from './Gallery.module.scss'
import { useEffect, useRef } from 'react';
import "./slide.scss";
import { useDispatch, useSelector } from 'react-redux';
import { handleOpenGalleryByAction } from '~/store/slice/appSlice';
import images from '~/assets/images';


const cx = classnames.bind(styles)

function Gallery() {
    const sliderRef = useRef()
    const imgRef = useRef()
    const dispatch = useDispatch()
    const imageUrls=[images.catFat, images.tanjirou, images.logo]

    const handlePressESC = (e) => {
        if (e.keyCode === 27) dispatch(handleOpenGalleryByAction(false));
    };

    const handleClickOutsideImg = (e) => {
        if (
            imgRef.current &&
            e.target.getAttribute("name") !== "slickButton" &&
            e.target.getAttribute("name") !== "slickButton-icon" &&
            imgRef.current.name !==
            e.target.getAttribute("name")
        ) {
            dispatch(handleOpenGalleryByAction(false));
        }
    };
    const app = useSelector(state => state.app)

    useEffect(() => {
        window.addEventListener("keydown", handlePressESC);
        window.addEventListener("mousedown", handleClickOutsideImg);

        return () => {
            window.removeEventListener("keydown", handlePressESC);
            window.removeEventListener("mousedown", handleClickOutsideImg);
        };
    }, []);

    const handleClickCloseBtn = () => {

    }

    // const settings = {
    //     infinite: "true",
    //     speed: 500,
    //     slidetoshow: 1,
    //     slidestoscroll: 1,
    //     initialSlide: 
    // };
    return (
        <div className="wrapper">
            <div className={cx('container')}>
                <Slider
                    ref={sliderRef}
                    {...app.settingSlide} 
                >
                    {
                        imageUrls.map((imageUrl, idx) => (
                            <span className={cx('img-box')} key={idx}>
                                <img name='img' ref={imgRef} src={imageUrl} />
                            </span>
                        ))
                    }
                </Slider>
                <div className={cx("custom-arrows")}>
                    <button
                        onClick={() => {
                            sliderRef.current.slickPrev();
                        }}
                        className={cx("back")}
                        name="slickButton"
                    >
                        <i name="slickButton-icon" className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                        onClick={() => {
                            sliderRef.current.slickNext();
                        }}
                        className={cx("next")}
                        name="slickButton"
                    >
                        <i name="slickButton-icon" className="fa-solid fa-chevron-right"></i>
                    </button>

                    <button className={cx("close")} onClick={handleClickCloseBtn}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Gallery;