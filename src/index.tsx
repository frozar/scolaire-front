/* @refresh reload */
import { render } from "solid-js/web";
import { StateActionProvider } from "./StateAction";
import { StateGuiProvider } from "./StateGui";

import "./css/index.css";
import App from "./App";

render(
  () => (
    <StateActionProvider>
      <StateGuiProvider>
        <App />
      </StateGuiProvider>
    </StateActionProvider>
  ),
  document.getElementById("root") as HTMLElement
);
