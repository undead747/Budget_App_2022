import React, { useRef, useState } from "react";
import "./auth.css";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../Auth/authContext";
import { useHomeController } from "../HomeContext";
import { CustomButton } from "../CommonComponents/Button/Button";

export default function Login() {
  const emailRef = useRef();
  const passRef = useRef();
  const { login } = useAuth();
  const {
    setLoading,
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
  } = useHomeController();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(emailRef.current.value, passRef.current.value);
      history.push("/");
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth__background">
        <div className="container auth__container">
          <div className="card auth__card">
            <div className="card-body auth__card-body">
              <h2 className="text-center auth__title">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email-label" className="form-label">
                    Email
                  </label>
                  <input
                    autoComplete="username"
                    type={"email"}
                    className="form-control"
                    ref={emailRef}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password-label" className="form-label">
                    Password
                  </label>
                  <input
                    autoComplete="new-password"
                    type={"password"}
                    className="form-control"
                    ref={passRef}
                    required
                  />
                </div>
                <CustomButton customClass={"auth__submit"} type={"submit"}>
                  Login
                </CustomButton>
              </form>
              <p className="text-center">
                Don't have an account ?{" "}
                <Link to={"/signup"}>
                  <strong>Sign up here</strong>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
