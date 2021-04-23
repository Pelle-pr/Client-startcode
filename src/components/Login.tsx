
import React, { useState } from "react"
import settings from "../utils/settings.json"
const loginURL = settings.loginEndpoint;

interface ILoginCredentials {
    userName: string,
    password: string
}
interface IKeyableLoginCredentials extends ILoginCredentials {
    [key: string]: any
}

type LoginProps = {
    setLoginStatus: Function
}

function LogIn({ setLoginStatus }: LoginProps) {
    const init: ILoginCredentials = { userName: "", password: "" };
    const [loginCredentials, setLoginCredentials] = useState(init);
    const [error, setError] = useState("");

    const performLogin = async (evt: React.FormEvent) => {
        evt.preventDefault();
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({ userName: loginCredentials.userName, password: loginCredentials.password })
        }
        setError("")
        try {
            const result = await fetch(loginURL, options).then(response => {
                if (!response.ok) {
                    throw new Error("Failed to login")
                }
                return response.json();
            })
            localStorage.setItem("base64AuthString", result.base64AuthString)
            localStorage.setItem("user", result.user)
            localStorage.setItem("role", result.role)
            setLoginStatus(true)
        } catch (err) {
            setError(err.message)
        }
    }

    const onChange = (evt: React.FormEvent<HTMLInputElement>) => {
        const id = evt.currentTarget.id;
        const value = evt.currentTarget.value;
        var newLoginCredentials: IKeyableLoginCredentials = { ...loginCredentials };
        setLoginCredentials({ ...newLoginCredentials, [id]: value })
    }

    return (
        <div style={style}>
            <h2>Login</h2>
            <form >
                <div className="form-group">
                    <label htmlFor="userName">Email address</label>
                    <input className="form-control" placeholder="User Name" id="userName" onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" placeholder="Password" id="password" onChange={onChange} />
                </div>
                <button onClick={performLogin} className="btn btn-primary">Login</button>
            </form>
            <p style={{ color: "red", marginTop: 20 }}>{error}</p>
        </div>
    )
}
const style = {
    width: 400,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100
}
export default LogIn