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
  setDoc,
} from "firebase/firestore";
import { fireStoreInst } from "./firebaseInitialize";
import { lowercaseObjectPropKeys } from "../Helpers/ObjectHelper";
import { getAuth } from "firebase/auth";

export const DatabaseCollections = {
  AccountCategory: "Account categories",
  ExpenseCategory: "Expense categories",
  IncomeCategory: "Income categories",
  Tasks: "Tasks",
  Budgets: "Budgets",
  Debts: "Debts",
  Demands: "Demands",
  Transfer: "Transfer",
  MailSyncDate: "MailSyncDate" 
};

export const TaskTotalDocId = "taskTotal";

export const useFirestore = (collectionName) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const addDocumentWithId = async (document, id) => {
     return await setDoc(doc(fireStoreInst, collectionName, user.uid, collectionName, id), {
      ...document,
      create_at: serverTimestamp(),
    });
  }

  const addDocument = async (document) => {
    return await addDoc(collection(fireStoreInst, collectionName, user.uid, collectionName), {
      ...document,
      create_at: serverTimestamp(),
    });
  };

  const updateDocument = async (document, docId) => {
    return await updateDoc(doc(fireStoreInst, collectionName, user.uid, collectionName, docId), {
      ...document,
      update_at: serverTimestamp(),
    });
  };

  const deleteDocument = async (docId) => {
    return await deleteDoc(doc(fireStoreInst, collectionName, user.uid, collectionName, docId));
  };

  const getDocumentById = async (id) => {
    const docRef = doc(fireStoreInst, collectionName, user.uid, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return

    return { data: docSnap.data(), id: docSnap.id }
  }

  const getDocuments = async () => {
    let results = await getDocs(query(collection(fireStoreInst, collectionName, user.uid, collectionName)));

    results = results.docs.map(doc => ({
      data: doc.data(),
      id: doc.id
    }))

    return results
  };

  const getDocumentsByPagination = async ({ pagination = { orderBy: "create_at", orderType: "desc" }, params = [] } = {}) => {
    const results = [];
    const queryConstraints = [];
    const orderConstraints = [];
    const orderkeys = [];

    params.forEach(param => {
      queryConstraints.push(where(param.key, param.operator, param.value ));
    })
    
    params.forEach(param => {
      if(!orderkeys.includes(param.key) && param.operator !== "=="){
        orderConstraints.push(orderBy(param.key, pagination.orderType ));
        orderkeys.push(param.key);
      }
    })

    let q = query(
      collection(fireStoreInst, collectionName, user.uid, collectionName),
      ...queryConstraints,
      ...orderConstraints,
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
    addDocumentWithId,
    updateDocument,
    deleteDocument,
    getDocuments,
    getDocumentsByPagination,
    getDocumentById
  };
};

export const useFirestoreRealtime = (collectionName) => {
  const [currentDocs, setCurrentDocs] = useState();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (collectionName && user) {
      const q = query(collection(fireStoreInst, collectionName, user.uid, collectionName), orderBy("Name"));
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
  }, [collectionName, user]);

  return currentDocs;
};
