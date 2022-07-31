import { useRouter } from "next/router";
import { useState } from "react"
import { authService, dbService } from "../fb";
import i from "../styles/Home.module.css"

export default function Home() {
  const [logsign, setLogsign] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()
  return (
    <div className={i.bigDiv}>
      <div className={i.smallDiv}>
        <h1>Welcome to Dis-Discord!</h1>
        <div>
        <form>
          <input className={i.username} id="username" type="text" placeholder="Username" onChange={a => setUsername(a.target.value)} />
          <input className={i.password} id="password" type="password" placeholder="Password" onChange={a => setPassword(a.target.value)} />
        </form>
          <button id="submit" onClick={() => {
            if (logsign) {
              authService.signInWithEmailAndPassword(username, password).catch(e => {alert(e.message)}).then(() => {
                router.replace("/chat")
              })
            } else {
              authService.createUserWithEmailAndPassword(username, password).catch(e => alert(e.message)).then(() => {
                dbService.doc(`Users/${authService.currentUser.uid}`).set({
                  dm: [],
                  server: [],
                  nickname: authService.currentUser.displayName
                })
                router.replace("/chat")
              })
            }
          }}>{logsign ? "Log In" : "Sign Up"}</button>
        </div>
          <p>Switch to <span onClick={() => {
            if (logsign) {
              setLogsign(false);
            } else {
              setLogsign(true);
            }
          }}>{logsign ? "Sign Up" : "Log In"}</span></p>
      </div>
    </div>
  )
}