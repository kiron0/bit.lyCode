import React from 'react'
import Logo from '../../assets/logo.png'
import styles from './Preloader.module.css';

export default function Preloader() {
          return (
                    <section className={styles.preloader}>
                              <div className={styles.box_section}>
                                        <div className={styles.image_box}>
                                                  <img alt={styles.image_preloader} src={Logo} className="site_logo" />
                                        </div>
                                        <div className={styles.img_filter}></div>
                              </div>
                    </section>
          )
}
