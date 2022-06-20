import Router from "next/router";
import {v4 as uuidv4} from "uuid";
import { authService } from "../../fb";
import i from "../../styles/Chat.module.css";

export default function chat() {
    if (authService.currentUser) {
        return (
            <div className={i.bigDiv}>
                <div className={i.dm}>
                    <h1>Direct Messages:</h1>
                    <div className={i.findDm}>
                        <h1>Your ID: {authService.currentUser.uid}</h1>
                        <form>
                            <input type="text" placeholder="Friend's ID"/>
                        </form>
                        <button onClick={() => console.log(uuidv4())}>Find</button>
                    </div>
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
                    <h1>You're not logged in!</h1>
                    <button onClick={() => {
                        Router.replace("/")
                    }}>Log In Here</button>
                </div>
            </div>
        )
    }
}