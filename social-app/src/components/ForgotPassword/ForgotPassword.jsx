/* eslint-disable react-hooks/rules-of-hooks */
import classnames from 'classnames/bind'

import styles from './forgotPassword.module.scss'
import images from '~/assets/images';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import routers from '~/config/routers';
import newRequet from '~/untils/request';
import { setEmailResetPassword } from '~/store/slice/appSlice';

const cx = classnames.bind(styles)

function ForgotPassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  console.log(useSelector((state) => state.account))

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    await newRequet.post('/users/forgotPassword', email, {
        headers: {
            "Content-Type": 'text/plain'
        }
    })
    .then(data => {
        console.log('Data from forgotPassword: ', data.data.data)
        dispatch(setEmailResetPassword(email))
        navigate(routers.resetPassword)
    })
    .catch(err => {
        console.log("Error when forgot password: ", err)
    })
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <form onSubmit={(e) => {handleForgotPassword(e)}} className={cx('login-form')}>
          <label className={cx('title')} htmlFor='username'>Forgot Password</label>
          <label className={cx('email')}>
            <input onChange={(e) => { setEmail(e.target.value) }} value={email} id='email' placeholder='Email' />
          </label>
          <div className={cx('btn-box')}>
            <button className={cx('login-btn')}>Countinue</button>
          </div>
          <div className={cx('login')}>
            {`Already have an account? `}<Link className={cx('link')} to={routers.login}>Login</Link>
          </div>
        </form>
        <div className={cx('image-box')}>
          <img src={images.catFat} />
        </div>
        <div className={cx('img-login')}>
          <img src={images.catLogin} />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword