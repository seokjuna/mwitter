import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { addDoc, collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Mweet from "../components/Mweet";

const Home = ({ userObj }) => {
    const [mweet, setMweet] = useState("");
    const [mweets, setMweets] = useState([]);

    // 실시간으로 db 가져오기
    useEffect(() => {
        const q = query(
            collection(dbService, "mweets"),
            orderBy("createdAt", "desc"),
        );
        onSnapshot(q, (snapshot) => {
            const mweetArr = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setMweets(mweetArr);
        })
    })
    
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(dbService, "mweets"), {
                text: mweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
            });
            console.log("Document written with ID: ", docRef);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        setMweet("");
    };

    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setMweet(value);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={mweet}
                    type="text"
                    placeholder="What's on your mind?"
                    onChange={onChange}
                    maxLength={120}
                />
                <input
                    type="submit"
                    value="Mweet"
                />
            </form>
            <div>
                {mweets.map((mweet) => (
                    <Mweet
                        key={mweet.id}
                        mweetObj={mweet}
                        isOwner={mweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;