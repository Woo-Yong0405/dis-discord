import Router from "next/router";
import { useEffect, useState } from "react";
import { authService, dbService, firebaseInstance } from "../../fb";
import i from "../../styles/Chat.module.css";

export default function chat() {
    if (authService.currentUser) {
        const [newFriend, setNewFriend] = useState("")
        useEffect(() => {
            dbService.doc(`Users/${authService.currentUser.uid}`).get().then(documenta => {
                const dmList = documenta.data().dm
                const friendList = document.getElementById("friendList");
                dmList.forEach(inn => {
                    const div = document.createElement("div");
                    const p = document.createElement("p");
                    const button = document.createElement("button");
                    let nickname;
                    dbService.doc(`Users/${inn}`).get().then(docca => {
                        nickname = docca.data().nickname
                        p.innerText = nickname;
                    })
                    div.append(p)
                    button.innerText = "Delete Friend"
                    button.className = i.deleteFriend
                    button.addEventListener("click", () => {
                        dbService.doc(`Users/${authService.currentUser.uid}`).update({
                            dm: firebaseInstance.firestore.FieldValue.arrayRemove(inn)
                        })
                        dbService.doc(`Users/${inn}`).update({
                            dm: firebaseInstance.firestore.FieldValue.arrayRemove(authService.currentUser.uid)
                        })
                    })
                    div.append(button)
                    friendList.append(div)
                })
            })
        }, [])
        return (
            <div className={i.bigDiv}>
                <div className={i.dm}>
                    <h1>Direct Messages:</h1>
                    <div className={i.findDm}>
                        <h1>Your ID: {authService.currentUser.uid}</h1>
                        <div className={i.newDiv}>
                            <input type="text" placeholder="Friend's ID" onChange={e => setNewFriend(e.target.value)}/>
                            <button onClick={() => {
                                if (newFriend !== "") {
                                    dbService.doc(`Users/${newFriend}`).onSnapshot(doc => {
                                        if (doc.exists) {
                                            if (newFriend != authService.currentUser.uid) {
                                                dbService.doc(`Users/${authService.currentUser.uid}`).onSnapshot(doca => {
                                                    const dmList = doca.data().dm;
                                                    if (!dmList.includes(newFriend)) {
                                                        dbService.doc(`Users/${authService.currentUser.uid}`).update({
                                                            dm: firebaseInstance.firestore.FieldValue.arrayUnion(newFriend)
                                                        })
                                                        dbService.doc(`Users/${newFriend}`).update({
                                                            dm: firebaseInstance.firestore.FieldValue.arrayUnion(authService.currentUser.uid)
                                                        })
                                                    } else {
                                                        alert("Already on DM list.")
                                                    }
                                                })
                                            } else {
                                                alert("You can't friend yourself. Are you that lonely?")
                                            }
                                        } else {
                                            alert("User does not exist.")
                                        }
                                    })
                                }
                            }}>Find</button>
                        </div>
                    </div>
                    <div id="friendList" className={i.list}></div>
                </div>
                <div className={i.servers}>
                    <h1>Servers:</h1>
                    <div className={i.list}></div>
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