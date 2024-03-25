import { useState } from 'react';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import Proptypes from 'prop-types'

import images from '~/assets/images';
import styles from './imageChatBox.module.scss';
import Icon from '../Icon/Icon';

const cx = classNames.bind(styles);

ImageChatBox.propTypes = {
    src: Proptypes.string,
    alt: Proptypes.string,
    onClick: Proptypes.func,
    active: Proptypes.bool,
    className: Proptypes.any,
    fallback: Proptypes.any
}

function ImageChatBox({ src, alt, onClick, active, className, fallback: customFallback = images.noAvatar, ...props }) {
    const [fallback, setFallback] = useState('');

    const handleError = () => {
        setFallback(customFallback);
    };

    return (
        <span className={cx('wrapper')}>
            <img
                onClick={onClick}
                className={className}
                src={fallback || src}
                alt={alt}
                {...props}
                onError={handleError}
            />
            {active && <Icon className={cx('state')} noBackground icon={faCircle} />}
        </span>
    );
}

export default ImageChatBox;
