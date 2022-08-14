export default {};
console.log("[debug-shim] ready");

window.addEventListener("message", (e) => {
  console.log(e.data);
});

window.addEventListener("click", (e) => {
  const action = (e.target as HTMLElement).closest("[data-action]")?.getAttribute("data-action");
  switch (action) {
    case "reset":
      console.log("reset");
      sendMessageFromMockMain({ reset: true });
      break;
  }
});

function sendMessageFromMockMain(message: any) {
  document.querySelector("iframe")!.contentWindow!.postMessage({ pluginMessage: message });
}
