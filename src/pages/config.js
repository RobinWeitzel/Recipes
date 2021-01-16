import * as React from "react"
import Layout from "../components/layout"
import styles from "./config.module.css"

export default function Config() {
    const [name, setName] = React.useState(null);
    const [repository, setRepository] = React.useState(null);
    const [branch, setBranch] = React.useState(null);
    const [token, setToken] = React.useState(null);

    React.useEffect(() => {
        if(name === null) {
            setName(localStorage.getItem("name") || "");
            setRepository(localStorage.getItem("repository") || "");
            setBranch(localStorage.getItem("branch") || "");
            setToken(localStorage.getItem("token") || "");
        }
    });

    const applyinput = fn => {
        return e => {
            fn(e.target.value);
        }
    }

    const save = () => {
        localStorage.setItem("name", name);
        localStorage.setItem("repository", repository);
        localStorage.setItem("branch", branch);
        localStorage.setItem("token", token);

        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redir') || "/";

        window.location.href = redirectUrl;
    }

    return (
        <Layout>
            <h2>Configure GitHub connection</h2>

            <h3 className={styles.h3}>Username</h3>
            <input className={styles.input} type="text" value={name} onChange={applyinput(setName)} />

            <h3 className={styles.h3}>Repository</h3>
            <input className={styles.input} type="text" value={repository} onChange={applyinput(setRepository)} />

            <h3 className={styles.h3}>Branch</h3>
            <input className={styles.input} type="text" value={branch} onChange={applyinput(setBranch)} />

            <h3 className={styles.h3}>Token</h3>
            <textarea className={styles.textarea} type="text" value={token} onChange={applyinput(setToken)} ></textarea>
            
            <button onClick={save} id={styles.button}>Save</button>
        </Layout>
    )
}