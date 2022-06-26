import { async } from "@firebase/util";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getDocsFromCache,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { fireStoreInst } from "../../Database/firebaseInitialize";

async function fetchFirebase() {
  try {
    const docs = await getDocs(collection(fireStoreInst, "test"));
    docs.forEach((doc) => {
      console.log(doc.data());
    });
  } catch (error) {
    console.log(error);
  }
}

export default function Test() {
  useEffect(() => {
    fetchFirebase();
  });

  return <div>Test</div>;
}
