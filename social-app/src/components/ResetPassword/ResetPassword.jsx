/* eslint-disable react-hooks/rules-of-hooks */
import classnames from 'classnames/bind'

import styles from './resetPassword.module.scss'
import images from '~/assets/images';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import routers from '~/config/routers';
import newRequet from '~/untils/request';
import { setEmailResetPassword } from '~/store/slice/appSlice';

const cx = classnames.bind(styles)

function ResetPassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { emailResetPassword } = useSelector(state => state.app)
  const [newPassword, setNewPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  console.log(useSelector((state) => state.account))

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (emailResetPassword!=='') {
        await newRequet.post('/users/resetPassword', {
            email: emailResetPassword, verificationCode, newPassword
        })
        .then(data => {
            console.log('Data from resetPassword: ', data.data.data)
            dispatch(setEmailResetPassword(''))
            alert('Reset password successfully')
            navigate(routers.login)
        })
        .catch(err => {
            // alert('')
            console.log("Error when reset password: ", err)
        })
    }
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <form onSubmit={(e) => {handleResetPassword(e)}} className={cx('login-form')}>
          <label className={cx('title')} htmlFor='username'>Forgot Password</label>
          <label className={cx('email')}>
            <input onChange={(e) => { setVerificationCode(e.target.value) }} value={verificationCode} id='verificationCode' placeholder='Verification Code' />
          </label>
          <label className={cx('newPassword')}>
            <input type='password' onChange={(e) => { setNewPassword(e.target.value) }} value={newPassword} id='newPassword' placeholder='New password' />
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

export default ResetPassword