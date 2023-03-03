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
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName || ""}
                    onChange={onChange}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update profile"
                    className="formBtn"
                    style={{
                        marginTop: 10
                    }}
                />
            </form>
            <button onClick={onLogOutClick} className="formBtn cancelBtn logOut">
                Log Out
            </button>
        </div>
    )
}

export default Profile;