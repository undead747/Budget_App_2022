import React from "react";
import { useHomeController } from "../../HomeContext";
import "./loading.css";

export default function Loading() {
  const { loading } = useHomeController();

  if (loading)
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
