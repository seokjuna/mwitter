import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../fbase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const Profile = ({ userObj }) => {
    const navigate = useNavigate();

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
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
        <button onClick={onLogOutClick}>
            Log Out
        </button>
    )
}

export default Profile;