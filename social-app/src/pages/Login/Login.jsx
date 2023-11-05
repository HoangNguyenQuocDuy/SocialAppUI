/* eslint-disable react-hooks/rules-of-hooks */
import classnames from 'classnames/bind'

import styles from './login.module.scss'
import images from '~/assets/images';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUserData } from '~/store/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { fetchLogin } from '~/store/slice/accountSlice';

const cx = classnames.bind(styles)

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  console.log(useSelector((state) => state.account))

  const handleSubmitUser = async (e) => {
    e.preventDefault()
    dispatch(fetchLogin({ username, password }))
      .then(data => {
        dispatch(fetchUserData(username))
        localStorage.setItem('accessToken', data.payload.accessToken)
        navigate('/')
      })

      .catch(err => {
        console.log('err: ', err)
      })
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <form className={cx('login-form')}>
          <label className={cx('title')} htmlFor='username'>Login</label>
          <label className={cx('username')}>
            <input onChange={(e) => { setUsername(e.target.value) }} value={username} id='username' placeholder='Username' />
          </label>
          <label className={cx('password')}>
            <input type='password' onChange={(e) => { setPassword(e.target.value) }} value={password} placeholder='Password' />
          </label>
          <div className={cx('btn-box')}>
            <button onClick={(e) => { handleSubmitUser(e) }} className={cx('login-btn')}>Countinue</button>
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

export default Login