import ContextStore from "@/store/store";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <ContextStore>
      <Toaster />
      <Component {...pageProps} />
    </ContextStore>
  );
}
