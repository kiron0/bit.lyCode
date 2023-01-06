import React, { useEffect, useState } from 'react'
import db from '../auth/Firebase/firebase.init'
import { useParams } from 'react-router-dom'
import styles from './Redirect.module.css'
import NotFound from '../shared/NotFound';

export default function Redirect() {
  const { slug } = useParams();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLinkDoc = () => {
      if (!slug) return;
      if (slug.length !== 6) return setLoading(false);
      let query = db.collection('urls').where('slug', '==', slug);
      query.onSnapshot((data) => {
        if (data === undefined) {
          return setLoading(false);
        } else {
          let finalData = data?.docs[0]?.data();
          if (finalData === undefined) return setLoading(false);
          // document.title = finalData?.urlName ? finalData?.urlName : "Bit.ly URL Shortener";
          window.location.href = finalData.url;
        }
      })
    }

    fetchLinkDoc();
  }, [slug, setLoading, loading])

  if (loading) {
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
  } else {
    return (
      <NotFound />
    )
  }
}
