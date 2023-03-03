import React, { useEffect, useRef, useState } from "react";
import { dbService } from "../fbase";
import { addDoc, collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Mweet from "../components/Mweet";

const Home = ({ userObj }) => {
    const [mweet, setMweet] = useState("");
    const [mweets, setMweets] = useState([]);
    const [attachment, setAttachment] = useState();

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
    };

    const onFileChange = (e) => {
        const {
            target: { files },
        } = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result }
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    };

    const fileInput = useRef();

    const onClearAttachment = () => {
        setAttachment(null);
        fileInput.current.value = null;
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
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    ref={fileInput}
                />
                <input
                    type="submit"
                    value="Mweet"
                />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
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