/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
//await import("./src/env.mjs");

// /** @type {import("next").NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true
})


module.exports = withPWA({
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  pwa: {
    dest: "public",
    register: true,
    disable: process.env.NODE_ENV === "development",
    skipWaiting: true,
  },
});


// const config = {
//   reactStrictMode: true,
//   i18n: {
//     locales: ["en"],
//     defaultLocale: "en",
//   },
// };

// export default config;
