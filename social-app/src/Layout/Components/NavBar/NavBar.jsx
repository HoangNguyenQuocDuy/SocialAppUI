import classNames from "classnames/bind";

import styles from './navbar.module.scss'
import NavItem from "~/components/NavItem";
import { NavLink } from "react-router-dom";
import Image from "~/components/Image/Image";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import images from "~/assets/images";

const cx = classNames.bind(styles)

const navItems = [
    {
        to: '/',
        icon: <i className="isax-convertshape1"></i>,
        content: 'Dashboard'
    },
    {
        to: '/rooms',
        icon: <i className="fa-regular fa-comment"></i>,
        content: 'Chat'
    },
]

const user = {
    userId: '123a',
    username: 'quocduy',
    currentName: 'Tanjirouuu (`･ω･´)',
    email: 'quocduy@tanjirouu.com',
    imageUrl: images.tanjirou,
  }

function NavBar() {

    return (
        <div className={cx('wrapper')}>
            <ul >
                {navItems.map((item, idx) => (
                    <NavLink key={idx}
                        to={item.to}
                    >
                        {/* eslint-disable-next-line no-unused-vars */}
                        {({ isActive, isPending }) => (
                            <li>
                                <NavItem active={isActive} icon={item.icon} unTo={true} content={item.content} middle />
                            </li>
                        )}
                    </NavLink>
                ))}
            </ul>

            <div className={cx('tool-user')}>
                <div className={cx('user-info')}>
                    <Image active mainImg={user.imageUrl} small/>
                </div>
                <div className={cx('setting-box')}>
                    <Tippy delay={[0, 200]} className={cx('sun-icon')} content="🌙 Night mode">
                        <span className={cx('sun-icon')}>
                            <i className="isax-sun-11"></i>
                        </span>
                    </Tippy>
                    <Tippy delay={[0, 200]} className={cx('setting-icon')} content="Setting">
                        <span className={cx('setting-icon')}>
                            <i className="isax-setting1"></i>
                        </span>
                    </Tippy>
                </div>
            </div>
        </div>
    );
}

export default NavBar;