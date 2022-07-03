import i from "../../styles/[to].module.css";
import { authService, dbService } from "../../fb";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";

export default function Id() {
    const router = useRouter();
    const query = router.query
    if (authService.currentUser) {
        dbService.doc(`Users/${authService.currentUser.uid}`).get().then(doc => {
            const dmList = doc.data().dm;
            if (dmList.includes(query.to)) {
                let messageList = [];
                dbService.collection("messages").where("author", "==",  authService.currentUser.uid).where("dm", "==", query.to).get().then(doc => {
                    doc.forEach(ment => {
                        messageList.push(ment)
                    })
                    console.log(messageList)
                })
            } else {
                return (
                    <div className={i.bigDiv}>
                        <div>
                            <h1 className={i.smallDiv}>This person is not in your friend list.</h1>
                            <button onClick={() => {
                                Router.push("/")
                            }}>Add</button>
                        </div>
                    </div>
                )
            }
        })
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