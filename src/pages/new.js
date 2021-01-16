import * as React from "react"
import Layout from "../components/layout"
import styles from "./new.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faTrash
} from '@fortawesome/free-solid-svg-icons'

export default function New() {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        if(user === null) {
            const name = localStorage.getItem("name");
            const token = localStorage.getItem("token");
            const repository = localStorage.getItem("repository");
            const branch = localStorage.getItem("branch");

            if(name && token && repository && branch) {
                setUser({
                    name,
                    token,
                    repository,
                    branch
                });
            } else {
                window.location.href = '/config?redir=/new'
            }
        }
    });

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [duration, setDuration] = React.useState("");
    const [difficulty, setDifficulty] = React.useState("");
    const [ingredients, setIngredients] = React.useState([]);
    const [instructions, setInstructions] = React.useState([]);

    const image = "";

    const save = () => {
        if(typeof window === 'undefined' || !window.GitHub) {
            return;
        }

        const github = new GitHub({
            token: user.token
        });

        const repository = github.getRepo(user.name, user.repository);

        const file = JSON.stringify({
            title,
            description,
            duration,
            difficulty,
            ingredients,
            instructions,
            image
        });

        const path = "src/recipes/" + title.toLowerCase().split(' ').join('_').replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss') + ".json";

        // Creates a new file (or updates it if the file already exists)
        // with the content provided
        repository.writeFile(
            user.branch, // e.g. 'master'
            path, // e.g. 'blog/index.md'
            file, // e.g. 'Hello world, this is my new content'
            'Edited recipe: ' + title, // e.g. 'Created new index'
            function (err, res, val) {
                if (err) {
                    localStorage.setItem("token", "");
                    window.location.href = '/config?redir=/new';
                } else {
                    window.location.href = '/';
                }
            }
        );   
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