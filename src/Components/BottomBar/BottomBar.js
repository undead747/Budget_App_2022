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
    expenseCategories,
    accountCategories,
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

    lastDate = lastDate[0].data.date;

    const payServiceMail = "yuchodebit@jp-bank.japanpost.jp";
    const apiUrl = `https://www.googleapis.com/gmail/v1/users/me/messages?q=after:${lastDate} from:${payServiceMail}`;
    const headers = {
      Authorization: `Bearer ${gmailUser.access_token}`,
    };

    var response = await axios.get(apiUrl, { headers });
    if (response && response.data && response.data.messages) {
      for (const mail of response.data.messages) {
        const apiUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${mail.id}`;
        const headers = {
          Authorization: `Bearer ${gmailUser.access_token}`,
        };

        const response = await axios.get(apiUrl, { headers });
        const inputString = response.data.snippet;

        // Extract shop name using regex
        let regex = /利用店舗\s(.*?)\s/;
        let match = regex.exec(inputString);
        let shopName = !match ? null : match[1];

        // Extract amount using regex
        regex = /利用金額\s(\d+)円/;
        match = regex.exec(inputString);
        const amount = !match ? null : match[1];

        regex = /\d{4}\/\d{2}\/\d{2}/;
        match = regex.exec(inputString);
        const date = !match ? null : match[0];

        if (amount && date)
          listMail.push({
            title: shopName,
            amount: amount,
            date: date,
          });
      }
    }

    if (listMail.length === 0) {
      setSucessModalContent("Your Account is up to date");
      handleSuccessShow();
    } else {
      setConfirmMailSyncModalContent(
        listMail,
        expenseCategories,
        accountCategories,
        setLoading
      );
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
