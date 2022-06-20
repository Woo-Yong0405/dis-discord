import Router from "next/router";
import { useState } from "react";
import {v4 as uuidv4} from "uuid";
import { authService, dbService, firebaseInstance } from "../../fb";
import i from "../../styles/Chat.module.css";

export default function chat() {
    if (authService.currentUser) {
        const [newFriend, setNewFriend] = useState("")
        return (
            <div className={i.bigDiv}>
                <div className={i.dm}>
                    <h1>Direct Messages:</h1>
                    <div className={i.findDm}>
                        <h1>Your ID: {authService.currentUser.uid}</h1>
                        <div className={i.newDiv}>
                            <input type="text" placeholder="Friend's ID" onChange={e => setNewFriend(e.target.value)}/>
                            <button onClick={() => {
                                if (dbService.doc(`Users/${newFriend}`).id != undefined) {
                                    dbService.doc(`Users/${authService.currentUser.uid}`).update({
                                        dm: firebaseInstance.firestore.FieldValue.arrayUnion(newFriend)
                                    })
                                    dbService.doc(`Users/${newFriend}`).update({
                                        dm: firebaseInstance.firestore.FieldValue.arrayUnion(authService.currentUser.uid)
                                    })
                                } else {
                                    alert("User does not exist.")
                                }
                            }}>Find</button>
                        </div>
                    </div>
                    <div></div>
                </div>
                <div className={i.servers}>
                    <h1>Servers:</h1>
                    <div></div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={i.bigDiv}>
                <div className={i.smallDiv}>
                    <h1>You are not logged in!</h1>
                    <button onClick={() => {
                        Router.replace("/")
                    }}>Log In Here</button>
                </div>
            </div>
        )
    }
}