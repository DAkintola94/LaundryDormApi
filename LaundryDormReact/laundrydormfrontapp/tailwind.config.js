/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // This enables class-based dark mode
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Path to your pages
      './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Path to your components
      './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Path to your app folder (for Next.js)
    ],
    theme: {
      extend: {
        colors: {
          primary: "#301934",
          dark: "#111111",
        },
      },
    },
    plugins: [],
  };
  