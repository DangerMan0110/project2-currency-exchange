import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getLatestRates() {
  const q = query(
    collection(db, "historical"),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return snapshot.docs[0].data();
}
