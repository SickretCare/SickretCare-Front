importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAlWP0FXG8XWU82mcdjMcPbtQcAH4ibcFM",
  authDomain: "team6-back.firebaseapp.com",
  projectId: "team6-back",
  storageBucket: "team6-back.appspot.com",
  messagingSenderId: "1074563581286",
  appId: "1:1074563581286:web:4ae49e4954b4540dca74a7",
  measurementId: "G-ZERTB37H8Z",
});

const messaging = firebase.messaging();

// 백그라운드에서 수신된 FCM 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "icon 주소",
    image: "image 주소",
    data: { url: payload.data.url },
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // 알림 닫기

  const url = event.notification.data.url;
  event.waitUntil(
    clients.openWindow(url) // 새 창에서 열기
  );
});
