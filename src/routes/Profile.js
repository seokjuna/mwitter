import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../fbase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";

const Profile = ({ userObj }) => {
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
    };

    const getMyMweets = async () => {
        const q = query(
            collection(dbService, "mweets"),
            where("creatorId", "==", `${userObj.uid}`),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => {
            console.log(document.id, "=>", document.data);
        });
    };

    useEffect(() => {
        getMyMweets();
    }, []);

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