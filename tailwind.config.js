module.exports = {
    important: true,
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require("tailwind-scrollbar"),
      require('@tailwindcss/line-clamp'),
      require("tailwindcss-textshadow")
    ],
  }
  