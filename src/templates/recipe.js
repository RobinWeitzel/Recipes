import React from "react"
import Layout from "../components/layout"
import styles from "./recipe.module.css"
import { graphql } from "gatsby"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faClock,
    faCog
} from '@fortawesome/free-solid-svg-icons'

export default function Recipe({ data }) {
    const recipe = data.allRecipesJson.edges[0].node;

    const ingredients = recipe.ingredients && recipe.ingredients.map(ingredient =>
        <li key={ingredient} className={styles.li}>
            <input type="checkbox" />
            <span className={styles.span}>{ingredient}</span>
        </li>)

    const instructions = recipe.instructions && recipe.instructions.map(instruction =>
        <li key={instruction} className={styles.li}>
            <span className={styles.span}>{instruction}</span>
        </li>)

    const standby = img => {
        img.currentTarget.src = 'https://webstockreview.net/images/icon-png-images-6.png';
    }

    const edit = () => {
        if(typeof window !== 'undefined' && window.document) {
            window.location.href = recipe.fields.edit;
        }
    }

    return (
        <Layout>
            <div id={styles.content}>
                <img id={styles.img} src="https://webstockreview.net/images/icon-png-images-6.png" alt="img" />
                <h2 className={styles.h2}>{recipe.title}</h2>
                <div className={styles.listItemTags}>
                    <div className={styles.duration}>
                        <FontAwesomeIcon icon={faClock} size="1x" />
                        <span className={styles.span}>{recipe.duration}</span>
                    </div>
                    <div className={styles.difficulty}>
                        <FontAwesomeIcon icon={faCog} size="1x" />
                        <span className={styles.span}>{recipe.difficulty}</span>
                    </div>
                </div>
                <div id={styles.description}>
                    {recipe.description}
                </div>
                <h3 className={styles.h3}>Ingredients</h3>
                <ul id={styles.ingredients}>
                    {ingredients}
                </ul>

                <h3 className={styles.h3}>Instructions</h3>
                <ol id={styles.instructions}>
                    {instructions}
                </ol>
            </div>
            <button onClick={edit} id={styles.button}>Edit</button>
        </Layout>
    )
}

export const query = graphql`
  query($slug: String!) {
    allRecipesJson(filter: {fields: {slug: {eq: $slug}}}) {
        edges {
          node {
            title
            description
            difficulty
            duration
            image
            ingredients
            instructions
            fields {
                edit
            }
          }
        }
      }
  }
`