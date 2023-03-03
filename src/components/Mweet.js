import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "../fbase";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Mweet = ({ mweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newMweet, setNewMweet] = useState(mweetObj.text);
    const MweetTextRef = doc(dbService, "mweets", `${mweetObj.id}`);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this mweet?");
        if (ok) {
            await deleteDoc(MweetTextRef);
            if (mweetObj.attachmentUrl !== "") {
                await deleteObject(ref(storageService, mweetObj.attachmentUrl));
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (e) => {
        e.preventDefault();
        await updateDoc(MweetTextRef, {
            text: newMweet,
        });
        setEditing(false);
    };

    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setNewMweet(value);
    };

    return (
        <div className="mweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container mweetEdit">
                        <input
                            type="text"
                            placeholder="Edit yout mweet"
                            value={newMweet}
                            onChange={onChange}
                            required
                            className="formInput"
                        />
                        <input
                            type="submit"
                            value="Update Mweet"
                            className="formBtn"
                        />
                    </form>
                    <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
                </>
            ) : (
                <>
                    <h4>{mweetObj.text}</h4>
                    {mweetObj.attachmentUrl && 
                        <img src={mweetObj.attachmentUrl} />
                    }
                    {isOwner && (
                        <div className="mweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Mweet;