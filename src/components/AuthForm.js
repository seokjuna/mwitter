import React, { useState } from "react";
import {
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword
} from "firebase/auth";
import { authService } from "../fbase";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    
    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newAccount) {
                // create account
                await createUserWithEmailAndPassword(authService, email, password);
            } else {
                // login
                await signInWithEmailAndPassword(authService, email, password);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleAccount = () => {
        setNewAccount((prev) => !prev)
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={onChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChange}
                    required
                />
                <input
                    type="submit"
                    value={newAccount ? "Create Account" : "Sign In"}
                />
                {error}
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign In" : "Create Account"}
            </span>
        </>
    )
}

export default AuthForm;