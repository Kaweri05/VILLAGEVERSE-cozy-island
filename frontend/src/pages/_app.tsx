import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
