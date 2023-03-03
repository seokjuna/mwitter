import React, { useEffect, useState } from "react";
import { dbService} from "../fbase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Mweet from "../components/Mweet";
import MweetFactory from "../components/MweetFactory";

const Home = ({ userObj }) => {
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
    
    

    return (
        <div>
            <div>
                <MweetFactory userObj={userObj} />
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