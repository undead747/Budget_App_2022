import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useHomeController } from "../HomeContext";
import { bottombarData } from "./BottomBarData";
import "./bottom-bar.css";
import Alert from "../Alert/Alert";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { DatabaseCollections, useFirestore } from "../../Database/useFirestore";
import { sendRequest } from "../../Helpers/APIHelper";
import { Modal } from "react-bootstrap";

const config = {
  client_id:
    "408641556052-4sbuh43oc06dhr7g71j0o0qkn7t4i3uu.apps.googleusercontent.com",
  project_id: "budgetapp-416707",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_secret: "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",
  redirect_uris: ["http://localhost:3000"],
  javascript_origins: ["http://localhost:3000"],
};

export default function BottomBar() {
  const {
    gmailUser,
    setGmailUser,
    selectedBottomTab,
    setSelectBottomTab,
    handleErrorShow,
    handleConfirmShow,
    handleConfirmClose,
    setConfirmModalContent,
    handleSuccessShow,
    handleSuccessClose,
    setSucessModalContent,
    setErrorModalContent,
    setLoading,
    handleConfirmMailSyncModalShow,
    handleConfirmMailSyncModalClose,
    setConfirmMailSyncModalContent,
  } = useHomeController();

  const history = useHistory();

  const { getDocuments: getLastSyncMailDate, addDocument: addSyncMailDate } =
    useFirestore(DatabaseCollections.MailSyncDate);

  const handleSelectedTab = (tab) => {
    if (tab.id === bottombarData.Sync.id) {
      loginGmail();
      return;
    }

    setSelectBottomTab(tab.id);
    history.push(tab.path);
  };

  useEffect(() => {
    let url = window.location.href;

    if (url.includes("statistics")) {
      setSelectBottomTab(bottombarData.Statistics.id);
      return;
    }

    if (url.includes("budgets")) {
      setSelectBottomTab(bottombarData.Budgets.id);
      return;
    }

    if (url.includes("settings")) {
      setSelectBottomTab(bottombarData.Settings.id);
      return;
    }

    if (
      url.includes("daily") ||
      url.includes("monthly") ||
      url.includes("calendar")
    ) {
      setSelectBottomTab(bottombarData.Tasks.id);
      return;
    }
  }, [window.location.href]);

  const syncMail = async () => {
    let lastDate = await getLastSyncMailDate();
    const listMail = [];

    setLoading(true);

    if (lastDate.length === 0) {
      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 to the month because months are zero-based
      const day = currentDate.getDate().toString().padStart(2, "0");

      lastDate = `${year}/${month}/${day}`;
      addSyncMailDate({ date: lastDate });
    }

    lastDate = "2024/02/28";

    const payServiceMail = "yuchodebit@jp-bank.japanpost.jp";
    const apiUrl = `https://www.googleapis.com/gmail/v1/users/me/messages?q=after:${lastDate} from:${payServiceMail}`;
    const headers = {
      Authorization: `Bearer ${gmailUser.access_token}`,
    };

    var response = await axios.get(apiUrl, { headers });
    if (response && response.data && response.data.messages) {
      response.data.messages.forEach((mail) => {
        const apiUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${mail.id}`;
        const headers = {
          Authorization: `Bearer ${gmailUser.access_token}`,
        };
        axios.get(apiUrl, { headers }).then((response) => {
          const inputString = response.data.snippet;

          // Extract shop name using regex
          const shopNameMatch = inputString.match(/店舗 (\S+) 利用金額/);
          const shopName = shopNameMatch ? shopNameMatch[1] : null;

          // Extract amount using regex
          const amountMatch = inputString.match(/利用金額 (\d+)円/);
          const amount = amountMatch ? amountMatch[1] : null;

          listMail.push({
            shop: shopName,
            amount: amount
          })
        });
      });
    }

    debugger;

    if (listMail.length === 0) {
      setSucessModalContent("Your Account is up to date");
      handleSuccessShow();
    } else {
      setConfirmMailSyncModalContent(listMail);
      handleConfirmMailSyncModalShow(true);
    }

    setLoading(false);
  };

  const loginGmail = useGoogleLogin({
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/gmail.readonly",
    ].join(" "),
    onSuccess: (codeResponse) => {
      setGmailUser(codeResponse);
    },
    onError: (error) => {
      setErrorModalContent("Login Failed:", error);
      handleErrorShow();
    },
  });

  useEffect(() => {
    if (gmailUser) {
      syncMail();
    }
  }, [gmailUser]);

  // useEffect(() => {
  //   console.log(gmailUser);
  //   if (gmailUser) {
  //     const apiUrl =
  //       "https://www.googleapis.com/gmail/v1/users/me/messages?q=after:2024/02/29 from:yuchodebit@jp-bank.japanpost.jp";
  //     const headers = {
  //       Authorization: `Bearer ${gmailUser.access_token}`,
  //     };

  //     axios
  //       .get(apiUrl, { headers })
  //       .then((response) => {
  //         response.data.messages.forEach((mail) => {
  //           console.log(mail);
  //           const apiUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${mail.id}`;
  //           const headers = {
  //             Authorization: `Bearer ${gmailUser.access_token}`,
  //           };
  //           axios.get(apiUrl, { headers }).then((response) => {
  //             console.log(response.data.snippet);
  //           });
  //         });
  //       })
  //       .catch((error) => {});
  //   }
  // }, [gmailUser]);

  return (
    <div className="bottom-bar">
      <div className="container">
        <ul className="nav-bar bottom-bar__content">
          {Object.keys(bottombarData).map((key) => {
            const tab = bottombarData[key];

            return (
              <li
                className={`nav-bar__item bottom-bar__item  ${
                  selectedBottomTab === tab.id ? "bottom-bar__item--active" : ""
                }`}
                key={tab.id}
                onClick={() => handleSelectedTab(tab)}
              >
                <div className="bottom-bar__item-content">
                  {tab.icon}
                  <span className="bottom-bar__title">{tab.title}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
