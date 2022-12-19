import React, { useEffect } from 'react'
import db from '../auth/Firebase/firebase.init'
import { useParams } from 'react-router-dom'
import styles from './Redirect.module.css'

export default function Redirect() {
  const { slug } = useParams();

  useEffect(() => {
    let query = db.collection('urls').where('slug', '==', slug);
    query.onSnapshot((data) => {
      let finalData = data.docs[0].data();
      window.location.href = finalData.url;
    })
  }, [slug])
  return (
    <div className={styles.preloader}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loader}>
            <div className={styles.dot}></div>
          </div>
          <div className={styles.loader}>
            <div className={styles.dot}></div>
          </div>
          <div className={styles.loader}>
            <div className={styles.dot}></div>
          </div>
          <div className={styles.loader}>
            <div className={styles.dot}></div>
          </div>
          <div className={styles.loader}>
            <div className={styles.dot}></div>
          </div>
          <div className={styles.loader}>
            <div className={styles.dot}></div>
          </div>
        </div>
        <div className={styles.text}>
          Redirecting
        </div>
      </div>
    </div>
  )
}
