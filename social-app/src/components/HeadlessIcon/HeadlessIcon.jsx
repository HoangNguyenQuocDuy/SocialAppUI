import classnames from 'classnames/bind'
import Tippy from "@tippyjs/react/headless";
import { useState } from "react";

import styles from './headlessIcon.module.scss'
import ListIcon from '../ListIcon/ListIcon';

const cx = classnames.bind(styles)

function HeadlessIcon() {
    const [showTippy, setShowTippy] = useState(false)
    
    
    return (<>
        <Tippy
            render={attrs => (
                <ListIcon {...attrs} />
            )}
            content='duy'
            onClickOutside={() => setShowTippy(false)}
            visible={showTippy}
        >
            <span className={cx('smile-icon', { active: showTippy })} onClick={() => {setShowTippy((prev) => !prev)}} ><i className="fa-regular fa-face-smile"></i></span>
        </Tippy>
    </>);
}

export default HeadlessIcon;