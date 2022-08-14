export default {};
console.log("[debug-shim] ready");

window.addEventListener("message", (e) => {
  console.log(e.data);
});
