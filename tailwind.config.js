module.exports = {
    important: true,
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                fadeIn: 'fadeIn .1s ease-in-out',
            },

            // that is actual animation
            keyframes: theme => ({
                fadeIn: {
                    '0%': { opacity: "0" },
                    '100%': { opacity: "1" },
                },
            }),
        },
    },
    plugins: [
        require("tailwind-scrollbar"),
        require('@tailwindcss/line-clamp'),
        require("tailwindcss-textshadow"),
    ],
}
  