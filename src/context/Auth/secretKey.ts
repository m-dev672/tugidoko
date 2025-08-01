import { firebaseApp } from "@/context/FirebaseUser/firebase";
import CryptoJS from 'crypto-js';
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

/**
 * シークレットキーを生成し、Firestoreに格納。
 */
async function getNewSecretKey(userId: string): Promise<string> {
  const secretKey = CryptoJS.lib.WordArray.random(256/8).toString()

  await setDoc(doc(db, "secretKeys", userId), {
    secretKey: secretKey
  });

  return secretKey
}

/**
 * シークレットキーをFirestoreから取得。
 * なければシークレットキーを生成し、Firestoreに格納。
 * 有効期限をつけたい。
 */
export async function getSecretKey(userId: string): Promise<string> {
  const docRef = doc(db, "secretKeys", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.secretKey) {
      return data.secretKey
    }
  }

  return await getNewSecretKey(userId)
}