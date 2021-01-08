import React from "react"
import styles from "./layout.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faSearch,
  faPlus
} from '@fortawesome/free-solid-svg-icons'

export default function Layout({ children }) {
  return (
    <div style={{ height: "100%" }}>
      <div id={styles.top}>
        {children}
      </div>
      <div id={styles.bottom}>
        <div className={styles.bottomicon}>
          <FontAwesomeIcon icon={faBookOpen} size="1x" />
        </div>
        <div className={styles.bottomicon}>
          <FontAwesomeIcon icon={faSearch} size="1x" />
        </div>
        <div className={styles.bottomicon}>
          <FontAwesomeIcon icon={faPlus} size="1x" />
        </div>
      </div>
    </div>
  )
}