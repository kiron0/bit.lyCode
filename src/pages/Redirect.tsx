import React, { useEffect, useState } from 'react'
import db from '../auth/Firebase/firebase.init'
import { useParams } from 'react-router-dom'
import styles from './Redirect.module.css'
import NotFound from '../shared/NotFound';

export default function Redirect() {
  const { slug } = useParams();
  const [finalURL, setFinalURL] = useState<string>('');

  useEffect(() => {
    let query = db.collection('urls').where('slug', '==', slug);
    query.onSnapshot((data) => {
      if (data === undefined) return <NotFound />;
      let finalData = data.docs[0].data();
      setFinalURL(finalData.slug);
      window.location.href = finalData.url;
    })
  }, [slug, finalURL, setFinalURL])

  return (
    <>
      {
        slug === finalURL ? (
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
        ) : (
          <NotFound />
        )
      }
    </>
  )
}
