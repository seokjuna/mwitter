import React, { useEffect, useRef, useState } from "react";
import { dbService, storageService } from "../fbase";
import { addDoc, collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Mweet from "../components/Mweet";

const Home = ({ userObj }) => {
    const [mweet, setMweet] = useState("");
    const [mweets, setMweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();

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
        let attachmentUrl = "";
        if (attachment !== "") {
            // 파일 경로 참조 만들기
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            // stoarge 참조 경로로 파일 업로드 하기
            const response = await uploadString(attachmentRef, attachment, "data_url");
            // // storage 참조 경로에 있는 파일의 URL을 다운로드해 attachmentUrl 변수에 넣어서 업데이트
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const mweetObj = {
            text: mweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }
        // 트윗하기 누르면 nweetObj 형태로 새로운 document를 생성하여 nweets 컬렉션에 넣기
        await addDoc(collection(dbService, "mweets"), mweetObj);
        // state 비워서 form 비우기
        setMweet("");
        // 파일 미리보기 img src 비우기
        setAttachment("");
        fileInput.current.value=null;
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

    const onClearAttachment = () => {
        setAttachment("");
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