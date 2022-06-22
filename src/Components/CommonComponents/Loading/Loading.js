import React from "react";
import { useAuth } from "../../../Auth/authContext";
import { useHomeController } from "../../HomeContext";
import "./loading.css";

export default function Loading() {
  const { loading } = useHomeController();
  const {currentUser} = useAuth();

  if (loading && !currentUser)
    return (
      <>
        <div className="page-loading">
          <div className="page-loading__content">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="page-loading__title">Loading...</h5>
          </div>
        </div>
      </>
    );

  return null;
}
