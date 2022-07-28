import { useEffect, useState } from "react";
import {
  doc,
  serverTimestamp,
  collection,
  updateDoc,
  deleteDoc,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
  query,
  addDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { fireStoreInst } from "./firebaseInitialize";
import { lowercaseObjectPropKeys } from "../Helpers/ObjectHelper";

export const DatabaseCollections = {
  AccountCategory: "Account category",
  ExpenseCategory: "Expense category",
  IncomeCategory: "Income category",
  Tasks: "Tasks",
};

export const useFirestore = (collectionName) => {
  const addDocument = async (document) => {
    return await addDoc(collection(fireStoreInst, collectionName), {
      ...document,
      create_at: serverTimestamp(),
    });
  };

  const updateDocument = async (document, docId) => {
    return await updateDoc(doc(fireStoreInst, collectionName, docId), {
      ...document,
      update_at: serverTimestamp(),
    });
  };

  const deleteDocument = async (docId) => {
    return await deleteDoc(doc(fireStoreInst, collectionName, docId));
  };

  const getDocumentById = async (id) => {
    const docRef = doc(fireStoreInst, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return

    return { data: docSnap.data(), id: docSnap.id }
  }

  const getDocuments = async () => {
    const results = await getDocs(collection(fireStoreInst, collectionName));
    return results.docs
  };

  const getDocumentsByPagination = async ({ pagination = { size: 10, orderBy: "create_at", orderType: "desc" }, params = null } = {}) => {
    const results = [];
    const queryConstraints = [];
    const queryOrders = [];

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] || params[key] === 0) {
          queryConstraints.push(where(key, '==', params[key]));
          queryOrders.push(orderBy(key, pagination.orderType))
        }
      })
    }

    const q = query(
      collection(fireStoreInst, collectionName),
      ...queryConstraints,
      orderBy(pagination.orderBy, pagination.orderType),
      limit(pagination.size)
    );

    const queryResults = await getDocs(q);

    queryResults.forEach(doc => {
      let data = lowercaseObjectPropKeys(doc.data());
      results.push({ ...data, id: doc.id });
    })

    return results
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    getDocuments,
    getDocumentsByPagination,
    getDocumentById
  };
};

export const useFirestoreRealtime = (collectionName) => {
  const [currentDocs, setCurrentDocs] = useState();

  useEffect(() => {
    if (collectionName) {
      const q = query(collection(fireStoreInst, collectionName), orderBy("Name"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = [];

        querySnapshot.forEach((doc) => {
          let data = lowercaseObjectPropKeys(doc.data());
          results.push({ ...data, id: doc.id });
        });

        setCurrentDocs(results);
      });

      return () => unsubscribe();
    }
  }, [collectionName]);

  return currentDocs;
};
