import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ColorModeScript } from "@chakra-ui/react";

import theme from "./theme";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>,
);
