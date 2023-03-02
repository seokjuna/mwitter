import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";

const Home = () => {
    const [mweet, setMweet] = useState("");
    const [mweets, setMweets] = useState([]);

    const getMweets = async () => {
        const q = query(collection(dbService, "mweets"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => {
            const mweetObject = {
                ...document.data(),
                id: document.id,
            };
            setMweets((prev) => [mweetObject, ...prev]);
        });
    };

    useEffect(() => {
        getMweets();
    }, []);
    
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(dbService, "mweets"), {
                mweet,
                createdAt: Date.now(),
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
                    <div key={mweet.id}>
                        <h4>{mweet.mweet}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;