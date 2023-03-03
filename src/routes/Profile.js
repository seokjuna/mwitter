import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../fbase";
import { getAuth, updateProfile } from "firebase/auth";

const Profile = ({ userObj, refreshUser }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.newDisplayName);

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setNewDisplayName(value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(auth.currentUser, { displayName: newDisplayName });
        };
        refreshUser();
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName || ""}
                    onChange={onChange}
                />
                <input
                    type="submit"
                    value="Update profile"
                />
            </form>
            <button onClick={onLogOutClick}>
                Log Out
            </button>
        </>
    )
}

export default Profile;