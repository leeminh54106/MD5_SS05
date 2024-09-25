/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // Reset tất cả các style mặc định của tailwind CSS
  corePlugins: {
    preflight: false,
  },
};
