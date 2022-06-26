import React from "react";
import { useEffect } from "react";
import { useAuth } from "../../../Auth/authContext";
import { useHomeController } from "../../HomeContext";
import "./loading.css";

export default function Loading({ children }) {
  const { loading, setLoading } = useHomeController();
  const { currentUser } = useAuth();

  useEffect(() => {
    if(!currentUser) setLoading(true);
    else setLoading(false);
  },[currentUser])

  return (
    <>
      {loading && (
        <div className="page-loading">
          <div className="page-loading__content">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="page-loading__title">Loading...</h5>
          </div>
        </div>
      )}
      {currentUser && children}
    </>
  );
}
