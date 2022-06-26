import React, { useState } from 'react'
import { doc, setDoc, serverTimestamp, collection, updateDoc, deleteDoc, getDocs, query, orderBy, limit  } from 'firebase/firestore'
import { fireStoreInst } from './firebaseInitialize'

export const DatabaseCollections = {
    AccountCategory: "Account category",
    ExpenseCategory: "Expense category",
    IncomeCategory: "Income category",
    Tasks: "Tasks"
}

export const Pagination = {
    size: 10,
    orderBy: "create_at",
    orderType: "desc"
}

export const useFirestore = (collectionName) => {
    const [currDoc, setCurrDoc] = useState();

    const addDocument = document => {
        return await setDoc(collection(fireStoreInst, collectionName), {...document, create_at: serverTimestamp()});
    }

    const updateDocument = document => {
        return await updateDoc(doc(fireStoreInst, collectionName, document.id), {...document.data, update_at: serverTimestamp()});
    }

    const deleteDocument = docId => {
        return await deleteDoc(doc(fireStoreInst, collectionName, docId));
    }

    const getDocument = (pagination) => {
        const query = query(collection(fireStoreInst, collectionName), orderBy(pagination.orderBy, pagination.orderType), limit(pagination.size));
        return await getDocs(query);
    }
}