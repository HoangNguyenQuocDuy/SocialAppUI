import classnames from 'classnames/bind'

import CreatePost from "~/components/CreatePost";
import styles from './home.module.scss'
import Stories from '~/components/Stories';
import Post from '~/components/Post';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchPostsData } from '~/store/slice/postSlice';

const cx = classnames.bind(styles)

function Home() {

  const [posts, setPosts] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPostsData())
    .then(data => {
      console.log('data from home page: ', data)
      setPosts(posts)
    })
    .catch(err => {
      console.log('Err when get posts: ', err)
    })
  }, [])

  console.log(posts)

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <aside className={cx('wrapper-left')}>
          <CreatePost />
          <div className={cx('stories')}>
            <Stories />
          </div>
          <div className={cx('posts')}>
            <div className={cx('post')}>
              <Post />
            </div>
            <div className={cx('post')}>
              <Post />
            </div>
            <div className={cx('post')}>
              <Post />
            </div>
          </div>
        </aside>
        <aside className={cx('wrapper-right')}>

        </aside>
      </div>
    </div>
  );
}

export default Home