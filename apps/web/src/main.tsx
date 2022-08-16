import { render } from "preact";
import { App } from "./app";

render(<App />, document.getElementById("app") as HTMLElement);

// start handling keyboard input
window.focus();
