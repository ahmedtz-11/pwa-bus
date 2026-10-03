# BusGo (Vue 3 + Vite PWA)

    npm install
    npm run dev       # develop (use your phone on the same Wi-Fi)
    npm run build     # production build in dist/ (generates manifest + service worker)
    npm run preview   # test install/offline on a production build

Serve `dist/` over HTTPS to make it installable. Replace the functions in
`src/stores/account.js` with real API calls (auth, top-up payment, card block).
