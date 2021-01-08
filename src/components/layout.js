import React from "react"
import styles from "./layout.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faSearch,
  faPlus
} from '@fortawesome/free-solid-svg-icons'

const redirect = path => {
  return () => {
    window.location.href = path;
  }
}

export default function Layout({ children }) {
  return (
    <div style={{ height: "100%" }}>
      <div id={styles.top}>
        {children}
      </div>
      <div id={styles.bottom}>
        <div className={styles.bottomicon}  onClick={redirect("/")}>
          <FontAwesomeIcon icon={faBookOpen} size="1x" />
        </div>
        <div className={styles.bottomicon}>
          <FontAwesomeIcon icon={faSearch} size="1x" />
        </div>
        <div className={styles.bottomicon}>
          <FontAwesomeIcon icon={faPlus} size="1x" onClick={redirect("/new")}/>
        </div>
      </div>
    </div>
  )
}