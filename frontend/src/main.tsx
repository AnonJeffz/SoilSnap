import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.js";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ModelProvider } from "./context/ModelContext.tsx";
import { flushQueueNow } from "./services/syncService"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ModelProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ModelProvider>
    </ThemeProvider>
  </StrictMode>
);

// ✅ Register the service worker (for PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (evt) => {
    console.log("SW message:", evt.data);
    // broadcast as window event so React components can listen easily
    window.dispatchEvent(new CustomEvent("sw-status", { detail: evt.data }));
  });
}

window.addEventListener("online", () => {
  flushQueueNow();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("SW registered successfully"))
      .catch((err) => console.error("SW registration failed:", err));
  });
}
