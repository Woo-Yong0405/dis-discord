import Router from "next/router";
import { useEffect, useState } from "react";
import { authService, dbService, firebaseInstance } from "../../fb";
import i from "../../styles/Chat.module.css";
import {v4 as uuidv4} from "uuid"

export default function chat() {
    if (authService.currentUser) {
        const [newFriend, setNewFriend] = useState("");
        const [nickname, setNickname] = useState("");
        const [newServer, setNewServer] = useState("");
        const [joinServer, setJoinServer] = useState("");
        useEffect(() => {
            dbService.doc(`Users/${authService.currentUser.uid}`).get().then(documenta => {
                const dmList = documenta.data().dm
                const friendList = document.getElementById("friendList");
                dmList.forEach(inn => {
                    const div = document.createElement("div");
                    const p = document.createElement("p");
                    const button = document.createElement("button");
                    const button2 = document.createElement("button");
                    button2.innerText = "Open Chat"
                    let nickname;
                    dbService.doc(`Users/${inn}`).get().then(docca => {
                        nickname = docca.data().nickname
                        p.innerText = nickname;
                    })
                    button2.addEventListener("click", () => {
                        Router.push(`/chat/${inn}?type=dm`)
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
                    div.append(button2)
                    div.append(button)
                    friendList.append(div)
                })
            })
            dbService.doc(`Users/${authService.currentUser.uid}`).onSnapshot(documenta => {
                const dmList = documenta.data().dm
                const friendList = document.getElementById("friendList");
                friendList.innerHTML = "";
                dmList.forEach(inn => {
                    const div = document.createElement("div");
                    const p = document.createElement("p");
                    const button = document.createElement("button");
                    const button2 = document.createElement("button");
                    button2.innerText = "Open Chat"
                    let nickname;
                    dbService.doc(`Users/${inn}`).get().then(docca => {
                        nickname = docca.data().nickname
                        p.innerText = nickname;
                    })
                    button2.addEventListener("click", () => {
                        Router.push(`/chat/${inn}?type=dm`)
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
                    div.append(button2)
                    div.append(button)
                    friendList.append(div)
                })
            })
            dbService.doc(`Users/${authService.currentUser.uid}`).get().then(documenta => {
                const dmList = documenta.data().server
                const friendList = document.getElementById("serverList");
                dmList.forEach(inn => {
                    const div = document.createElement("div");
                    const p = document.createElement("p");
                    const button = document.createElement("button");
                    const button2 = document.createElement("button");
                    button2.innerText = "Open Server"
                    let nickname;
                    dbService.doc(`Servers/${inn}`).get().then(docca => {
                        nickname = docca.data().name
                        p.innerText = nickname;
                    })
                    button2.addEventListener("click", () => {
                        Router.push(`/chat/${inn}?type=server`)
                    })
                    div.append(p)
                    button.innerText = "Leave"
                    button.className = i.deleteFriend
                    button.addEventListener("click", () => {
                        dbService.doc(`Users/${authService.currentUser.uid}`).update({
                            server: firebaseInstance.firestore.FieldValue.arrayRemove(inn)
                        })
                        dbService.doc(`Servers/${inn}`).update({
                            members: firebaseInstance.firestore.FieldValue.arrayRemove(authService.currentUser.uid)
                        })
                        dbService.doc(`Servers/${inn}`).get().then(doc => {
                            const dmListList = doc.data().members
                            if (dmListList.length == 0) {
                                dbService.doc(`Servers/${inn}`).delete()
                            }
                        })
                    })
                    div.append(button2)
                    div.append(button)
                    friendList.append(div)
                })
            })
            dbService.doc(`Users/${authService.currentUser.uid}`).onSnapshot(documenta => {
                const dmList = documenta.data().server
                const friendList = document.getElementById("serverList");
                friendList.innerHTML = "";
                dmList.forEach(inn => {
                    const div = document.createElement("div");
                    const p = document.createElement("p");
                    const button = document.createElement("button");
                    const button2 = document.createElement("button");
                    button2.innerText = "Open Server"
                    dbService.doc(`Servers/${inn}`).get().then(docca => {
                        p.innerText = docca.data().name;
                    })
                    button2.addEventListener("click", () => {
                        Router.push(`/chat/${inn}?type=server`)
                    })
                    div.append(p)
                    button.innerText = "Leave"
                    button.className = i.deleteFriend
                    button.addEventListener("click", () => {
                        dbService.doc(`Users/${authService.currentUser.uid}`).update({
                            server: firebaseInstance.firestore.FieldValue.arrayRemove(inn)
                        })
                        dbService.doc(`Servers/${inn}`).update({
                            members: firebaseInstance.firestore.FieldValue.arrayRemove(authService.currentUser.uid)
                        })
                        dbService.doc(`Servers/${inn}`).get().then(doc => {
                            const dmListList = doc.data().members
                            if (dmListList.length == 0) {
                                dbService.doc(`Servers/${inn}`).delete()
                            }
                        })
                    })
                    div.append(button2)
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
                                    dbService.doc(`Users/${newFriend}`).get().then(doc => {
                                        if (doc.exists) {
                                            if (newFriend != authService.currentUser.uid) {
                                                dbService.doc(`Users/${authService.currentUser.uid}`).get().then(doca => {
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
                    <h1>Change Nickname:</h1>
                    <div className={i.fcServer}>
                        <input type="text" placeholder="New Nickname" onChange={e => setNickname(e.target.value)} />
                        <button onClick={() => {
                            dbService.doc(`Users/${authService.currentUser.uid}`).update({
                                nickname: nickname
                            }).then(() => {
                                alert("Nickname Changed Successfully to " + nickname)
                            })
                        }}>Change</button>
                    </div>
                    <h1>Join or Create Server:</h1>
                    <div className={i.fcServer}>
                        <input type="text" placeholder="Server Name" onChange={e => setNewServer(e.target.value)} />
                        <button onClick={() => {
                            const serverID = uuidv4();
                            dbService.doc(`Servers/${serverID}`).set({
                                members: [authService.currentUser.uid],
                                name: newServer,
                            })
                            dbService.doc(`Users/${authService.currentUser.uid}`).update({
                                server: firebaseInstance.firestore.FieldValue.arrayUnion(serverID)
                            })
                        }}>Create</button>
                    </div>
                    <div className={i.fcServer}>
                        <input type="text" placeholder="Server ID" onChange={e => setJoinServer(e.target.value)} />
                        <button onClick={() => {
                            dbService.doc(`Servers/${joinServer}`).get().then(doc => {
                                if (doc.exists) {
                                    dbService.doc(`Servers/${joinServer}`).update({
                                        members: firebaseInstance.firestore.FieldValue.arrayUnion(authService.currentUser.uid)
                                    })
                                    dbService.doc(`Users/${authService.currentUser.uid}`).update({
                                        server: firebaseInstance.firestore.FieldValue.arrayUnion(joinServer)
                                    })
                                } else {
                                    alert("Server doesn't exist.")
                                }
                            })
                        }}>Find</button>
                    </div>
                    <div id="serverList" className={i.list}></div>
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