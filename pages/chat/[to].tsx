import i from "../../styles/[to].module.css";
import { authService, dbService, firebaseInstance } from "../../fb";
import Router, { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const asdfFunc = async (asdf: string | any[]) => {
    const duv = document.getElementById("asss");
    duv.innerHTML = "";
    for(let a = 0; a < asdf.length; a++) {
        const aaa = document.getElementById("asss");
        const div = document.createElement("div");
        const h1 = document.createElement("h1");
        div.className = i.message
        await dbService.doc(`Users/${asdf[a].data().author}`).get().then(doc => {
            h1.innerHTML = doc.data().nickname + ": " + asdf[a].data().content;
            div.append(h1);
            aaa.append(div);
        })
    }
}

function messageFunc(query: ParsedUrlQuery) {
    dbService.collection("messages").where("author", "==",  query.to).where("dm", "==", authService.currentUser.uid).get().then(docu => {
        var asdf = [];
        docu.forEach(ment => {
            asdf.push(ment)
        })
        dbService.collection("messages").where("author", "==", authService.currentUser.uid).where("dm", "==", query.to).get().then(async ddd => {
            ddd.forEach(ssss => {
                asdf.push(ssss)
            })
            asdf.sort(function (a, b) {
                return a.data().timestamp.seconds - b.data().timestamp.seconds;
            })
            await asdfFunc(asdf)
        })
    })
}

export default function Id() {
    const router = useRouter();
    const query = router.query
    if (authService.currentUser) {
        dbService.doc(`Users/${authService.currentUser.uid}`).get().then(doc => {
            const dmList = doc.data().dm;
            if (dmList.includes(query.to)) {
                dbService.collection("messages").onSnapshot(() => {
                    messageFunc(query)
                })
            } else {
                return (
                    <div className={i.bigDiv}>
                        <div className={i.smallDiv}>
                            <h1 className={i.smallDiv}>This person is not in your friend list.</h1>
                            <button onClick={() => {
                                Router.push("/")
                            }}>Add</button>
                        </div>
                    </div>
                )
            }
        })
        return (
            <div className={i.big}>
                <div className={i.messages} id="asss"></div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (query.type == "dm") {
                        dbService.collection("messages").add({
                            author: authService.currentUser.uid,
                            dm: query.to,
                            server: null,
                            content: (e.nativeEvent.target as Element).children[0].nodeValue,
                            timestamp: firebaseInstance.firestore.FieldValue.serverTimestamp()
                        })
                    }
                    (e.nativeEvent.target as Element).children[0].nodeValue = "";
                }}>
                    <input type="text" />
                </form>
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