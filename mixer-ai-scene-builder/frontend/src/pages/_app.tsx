import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { printLuckyCharm } from '@/utils/signature';

export default function App({ Component, pageProps }: AppProps) {
  printLuckyCharm();
  return <Component {...pageProps} />;
}
