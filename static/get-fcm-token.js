import { getCookie, getAccessTokenWithRefreshToken } from "./tokenUtils.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getMessaging,
  getToken,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging.js";

const API_SERVER_DOMAIN = "https://sickretcare.store/";

document.addEventListener("DOMContentLoaded", function () {
  // Firebase 설정
  const firebaseConfig = {
    apiKey: "AIzaSyAlWP0FXG8XWU82mcdjMcPbtQcAH4ibcFM",
    authDomain: "team6-back.firebaseapp.com",
    projectId: "team6-back",
    storageBucket: "team6-back.appspot.com",
    messagingSenderId: "1074563581286",
    appId: "1:1074563581286:web:4ae49e4954b4540dca74a7",
    measurementId: "G-ZERTB37H8Z",
  };

  // Firebase 초기화
  initializeApp(firebaseConfig);
  const messaging = getMessaging();

  async function registerServiceWorkerAndGetToken() {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log(
        "Service Worker registration successful with scope: ",
        registration.scope
      );

      // 서비스 워커 준비 대기
      await navigator.serviceWorker.ready;

      // FCM 토큰 가져오기
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BCu0DBxiL691NdPTnexBqrsMBtaVKRJvTNPgL1ANVkfxwACOf5BQ_gGgvuaEyP7uTwjRELFSZHts93G0hFuYhG0",
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        console.log("FCM Token:", currentToken);
        // 로컬 스토리지에 저장
        localStorage.setItem("fcmToken", currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      console.error("Service Worker registration failed: ", err);
    }
  }

  async function requestPermissionAndRegisterSW() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      await registerServiceWorkerAndGetToken();
      // 로컬 스토리지에서 토큰 가져오기
      const fcmToken = localStorage.getItem("fcmToken");
      if (fcmToken) {
        const accessToken = getCookie("access_token");
        const response = await fetch(API_SERVER_DOMAIN + "users/", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fcm_token: fcmToken }),
        });
        if (!response.ok) {
          alert("알림 권한 설정에 실패했습니다. ");
        }
      } else {
        console.log("FCM Token not found in local storage.");
      }
    } else {
      console.log("Unable to get permission to notify.");
    }
  }

  requestPermissionAndRegisterSW();
});
