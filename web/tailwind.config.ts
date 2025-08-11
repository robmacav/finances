import { type Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue
      },
      heigh: {
        'screen-minus-100': 'calc(100vh - 100px)',
        'screen-minus-200': 'calc(100vh - 200px)',
        'screen-minus-300': 'calc(100vh - 300px)',
        'screen-minus-400': 'calc(100vh - 400px)'
      }
    }
  },
  plugins: [],
};

export default config;
