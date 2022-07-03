import {i} from "../../styles/[to].module.css";
import { dbService } from "../../fb";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function id() {
    const router = useRouter();
    const query = router.query
    dbService.doc(`Users/${query.from}`).get().then(doc => {
        console.log(doc.data().dm)
    })
}