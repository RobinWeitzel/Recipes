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
        let user = netlifyIdentity.currentUser();
        
        if(!user) {
            netlifyIdentity.init();
            user = netlifyIdentity.currentUser();
        }

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

    function getData(mypath = '') {
        let user = netlifyIdentity.currentUser()
        let token = user.token.access_token
    
        const url = "/.netlify/git/github/contents/" + mypath
        const bearer = 'Bearer ' + token
        return fetch(url, {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                }
            }).then(resp => {
                return resp.json()
            }).then(data => {
    
                if (data.code == 400) {
    
                    netlifyIdentity.refresh().then(function(token) {
                        getData(mypath)
                    })
    
                } else {
                    // base64 decode content
                    data.content = atob(data.content)
                    return data
                }
            })
            .catch(error => {
                return error
            })
    
    }
    
    function saveData(mypath, data) {
    
        getData(mypath).then(function(curfile) {
    
            let user = netlifyIdentity.currentUser()
            let token = user.token.access_token
    
            let opts = {
                path: mypath,
                message: "Edited recipe " + title,
                content: btoa(data),
                branch: "gh-pages",
                committer: { name: "RobinWeitzel", email: "robin.weitzel.rw@gmail.com" },
            }
    
            if (typeof curfile !== 'undefined') {
                opts.sha = curfile.sha
            }
    
            const url = "/.netlify/git/github/contents/" + mypath
            const bearer = 'Bearer ' + token
            fetch(url, {
                    body: JSON.stringify(opts),
                    method: 'PUT',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Authorization': bearer,
                        'Content-Type': 'application/json'
                    }
                }).then(resp => {
                    return resp.json()
                }).then(data => {
                    if (data.code == 400) {
    
                        netlifyIdentity.refresh().then(function(token) {
                            saveData(mypath)
                        })
    
                    } else {
                        return data
                    }
                })
                .catch(error => console.error(error))
    
        })
    
    }

    const save = () => {

        saveData(path, JSON.stringify({
            title,
            description,
            duration,
            difficulty,
            ingredients,
            instructions,
            image
        }));      
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