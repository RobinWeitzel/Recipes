import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import styles from "./edit.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faTrash
} from '@fortawesome/free-solid-svg-icons'
import netlifyIdentity from 'netlify-identity-widget';

export default function Edit({ data }) {
    React.useEffect(() => {
        netlifyIdentity.init();

        const user = netlifyIdentity.currentUser();

        console.log(user)

        if(!user) {
            netlifyIdentity.open();
        }
    });

    const [title, setTitle] = React.useState(data.allRecipesJson.edges[0].node.title || "");
    const [description, setDescription] = React.useState(data.allRecipesJson.edges[0].node.description || "");
    const [duration, setDuration] = React.useState(data.allRecipesJson.edges[0].node.duration || "");
    const [difficulty, setDifficulty] = React.useState(data.allRecipesJson.edges[0].node.difficulty || "");
    const [ingredients, setIngredients] = React.useState(data.allRecipesJson.edges[0].node.ingredients || []);
    const [instructions, setInstructions] = React.useState(data.allRecipesJson.edges[0].node.instructions || []);

    const image = data.allRecipesJson.edges[0].node.image || "";
    const path = data.allRecipesJson.edges[0].node.fields.path;

    const save = () => {
        const user = netlifyIdentity.currentUser();

        if(!user ) { // || user.token.expires_at >= Date.now()
            console.log("token expired");
            netlifyIdentity.open();
            return;
        }

        const token = user.token.access_token;

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": 'Bearer ' + token
            },
            body: JSON.stringify({
                branch: "gh-pages",
                message: "Edited recipe: " + title,
                content: Buffer.from(JSON.stringify({
                    title,
                    description,
                    duration,
                    difficulty,
                    ingredients,
                    instructions,
                    image
                })).toString('base64')
            })
        };

        fetch('/.netlify/git/github/contents' + path, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));        
    }

    const ingredientsList = ingredients.map((ingredient, i) => {
        const removeIngredient = () => {
            setIngredients(ingredients.filter((item, j) => i !== j));
        }

        const changeIngredient = e => {
            setIngredients(ingredients.map((item, j) => {
                if (j === i) {
                    return e.target.value;
                } else {
                    return item;
                }
            })
            );
        }

        return (<li className={styles.li}>
            <input className={styles.input} type="text" value={ingredient} onChange={changeIngredient} />
            <span className={styles.span} onClick={removeIngredient}>
                <FontAwesomeIcon icon={faTrash} size="1x" />
            </span>
        </li>)
    })

    const instructionsList = instructions.map((instruction, i) => {
        const removeInstruction = () => {
            setInstructions(instructions.filter((item, j) => i !== j));
        }

        const changeInstruction = e => {
            setInstructions(instructions.map((item, j) => {
                if (j === i) {
                    return e.target.value;
                } else {
                    return item;
                }
            })
            );
        }

        return (<li className={styles.li}>
            <input className={styles.input} type="text" value={instruction} onChange={changeInstruction} />
            <span className={styles.span} onClick={removeInstruction}>
                <FontAwesomeIcon icon={faTrash} size="1x" />
            </span>
        </li>)
    })

    const addIngredient = () => {
        setIngredients(() => ingredients.concat(""));
    }

    const addInstruction = () => {
        setInstructions(() => instructions.concat(""));
    }

    const applyinput = fn => {
        return e => {
            fn(e.target.value);
        }
    }

    return (
        <Layout>
            <div id={styles.content}>
                <img id={styles.img} src="https://webstockreview.net/images/icon-png-images-6.png" />

                <h3 className={styles.h3}>Title</h3>
                <input className={styles.input} type="text" id={styles.title} value={title} onChange={applyinput(setTitle)} />

                <h3 className={styles.h3}>Duration</h3>
                <input className={styles.input} type="text" id={styles.duration} value={duration} onChange={applyinput(setDuration)} />

                <h3 className={styles.h3}>Difficulty</h3>
                <input className={styles.input} type="text" id={styles.difficulty} value={difficulty} onChange={applyinput(setDifficulty)} />

                <h3 className={styles.h3}>Description</h3>
                <textarea className={styles.textarea} type="text" id={styles.description} value={description} onChange={applyinput(setDescription)} ></textarea>

                <h3 className={styles.h3}>Ingredients <span onClick={addIngredient}><FontAwesomeIcon icon={faPlus} size="1x" /></span></h3>
                <ul id={styles.ingredients}>
                    {ingredientsList}
                </ul>

                <h3 className={styles.h3}>Instructions <span onClick={addInstruction}><FontAwesomeIcon icon={faPlus} size="1x" /></span></h3>
                <ul id={styles.instructions}>
                    {instructionsList}
                </ul>
            </div>
            <button onClick={save} id={styles.button}>Save</button>
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
                        path
                    }
                }
            }
      }
  }
`