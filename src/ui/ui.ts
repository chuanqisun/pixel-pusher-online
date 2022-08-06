async function main() {
  document.getElementById("arrow-keys")!.onclick = (e) => {
    const dir = (e.target as HTMLElement)!.closest("[data-direction]")!.getAttribute("data-direction");
    console.log(dir);
    const message = { pluginMessage: { dir } };
    parent.postMessage(message, "*");
  };
}

main();
