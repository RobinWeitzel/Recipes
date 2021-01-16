import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import styles from "./index.module.css"
import { Link } from "gatsby"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronRight,
  faClock,
  faCog
} from '@fortawesome/free-solid-svg-icons'

export default function Index({ data }) {
  const edges = data.allRecipesJson.edges;

  const standby = img => {
    console.log(img)
    img.currentTarget.src = 'https://webstockreview.net/images/icon-png-images-6.png';
  }

  const list = edges.map(edge => {
    const recipe = edge.node;

    return (
      <Link key={recipe.fields.slug} className={styles.listItem} to={recipe.fields.slug}>
        <img src="https://webstockreview.net/images/icon-png-images-6.png" onError={standby} />
        <div className={styles.listItemText}>
          <div className={styles.listItemTitle}>
            { recipe.title }
          </div>
          <div className={styles.listItemSummary}>
            { recipe.description && recipe.description.substring(0, 60) }
      </div>
          <div className={styles.listItemTags}>
            <div className={styles.duration}>
              <FontAwesomeIcon icon={faClock} size="1x"/>
              <span className={styles.span}>{recipe.duration}</span>
            </div>
            <div className={styles.difficulty}>
              <FontAwesomeIcon icon={faCog} size="1x" />
              <span className={styles.span}>{recipe.difficulty}</span>
            </div>
          </div>
        </div>
        <div className={styles.listTtemChevron}>
          <FontAwesomeIcon icon={faChevronRight} size="1x" />
        </div>
      </Link>)
  })

  return (
    <Layout>
      <h2>Browse Cookbook</h2>
      <div className={styles.list}>
        {list}
      </div>
    </Layout>
  )
}


export const query = graphql`
  query {
    allRecipesJson {
      edges {
        node {
          fields {
            slug
          }
          title
          image
          description
          duration
          difficulty
        }
      }
    }
  }
`
