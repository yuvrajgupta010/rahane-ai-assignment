import ContextStore from "@/store/store";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ContextStore>
      <Component {...pageProps} />
    </ContextStore>
  );
}
