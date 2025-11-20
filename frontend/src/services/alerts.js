import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function addAlert(currency, target, direction) {
  await addDoc(collection(db, "alerts"), {
    currency,
    direction,
    target: Number(target),
    createdAt: serverTimestamp(),

    triggered: false,
    triggeredAt: null,
  });
}
