/* eslint-disable react-hooks/rules-of-hooks */
import classnames from 'classnames/bind'

import styles from './register.module.scss'
import images from '~/assets/images';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import newRequet from '~/untils/request';
import { fetchRegister } from '~/store/slice/accountSlice';
import routers from '~/config/routers';

const cx = classnames.bind(styles)

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleUploadImage = async (e) => {
    const formData = new FormData()

    formData.append("image", e.target.files[0])

    const response = await newRequet.post(
      '/cloudinary/upload',
      formData)
    setImageUrl(response.data.data.secure_url)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const userData = {
      username: username.trim(),
      password: password.trim(),
      email: email.trim(),
      currentName: currentName.trim(),
      imageUrl: imageUrl
    };

    if (username.trim() === '') {
      alert("Username is requied!")
    }
    else if (password.trim() === '') {
      alert("Password is requied!")
    }
    else if (email.trim() === '') {
      alert("Email is requied!")
    }
    else if (currentName.trim() === '') {
      alert("CurrentName is requied!")
    } else {
      console.log(userData)
      dispatch(fetchRegister(userData))
        .then(data => {
          console.log(data)
          navigate('/login')
        })
        .catch(err => {
          console.log('err: ', err)
        })
    }
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <form className={cx('login-form')} onSubmit={(e => { handleRegister(e) })}>
          <label className={cx('title')} htmlFor='username'>Regitser</label>
          <label className={cx('username')}>
            <input onChange={(e) => { setUsername(e.target.value) }} value={username} id='username' placeholder='Username' />
          </label>
          <label className={cx('password')}>
            <input type='password' onChange={(e) => { setPassword(e.target.value) }} value={password} placeholder='Password' />
          </label>
          <label className={cx('email')}>
            <input onChange={(e) => { setEmail(e.target.value) }} value={email} id='email' placeholder='Email' />
          </label>
          <label className={cx('currentName')}>
            <input onChange={(e) => { setCurrentName(e.target.value) }} value={currentName} id='Current name' placeholder='currentName' />
          </label>
          <label className={cx('imageUrl')}>
            <input type='file' onChange={(e) => { handleUploadImage(e) }} id='imageUrl' placeholder='imageUrl' />
          </label>
          <div className={cx('btn-box')}>
            <button className={cx('login-btn')}>Register</button>
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

export default Register