import React, { useState } from "react";
import { storageService, dbService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { uploadString, getDownloadURL, ref } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const MweetFactory = ({ userObj }) => {
    const [mweet, setMweet] = useState("");
    const [attachment, setAttachment] = useState("");
    
    const onSubmit = async (e) => {
        if (mweet === "") {
            return;
        }
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
        // 트윗하기 누르면 mweetObj 형태로 새로운 document를 생성하여 mweets 컬렉션에 넣기
        await addDoc(collection(dbService, "mweets"), mweetObj);
        // state 비워서 form 비우기
        setMweet("");
        // 파일 미리보기 img src 비우기
        setAttachment("");
        
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
    };

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    value={mweet}
                    type="text"
                    placeholder="What's on your mind?"
                    onChange={onChange}
                    maxLength={120}
                    className="factoryInput__input"
                />
                <input
                    type="submit"
                    value="&rarr;"
                    className="factoryInput__arrow"
                />
            </div>
            <label
                htmlFor="attach-file"
                className="factoryInput__label"
            >
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img 
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div
                        className="factoryForm__clear"
                        onClick={onClearAttachment}
                    >
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default MweetFactory;