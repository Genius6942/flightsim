import eruda from "eruda";
// @ts-ignore
import erudaCode from "eruda-code";

// @ts-ignore
if (import.meta.env.DEV) {
  eruda.init();
  eruda.add(erudaCode);

  if (localStorage.getItem("eruda-auto-show") === "1") eruda.show();
  window.addEventListener("keydown", (e) => {
    const { key, ctrlKey } = e;
    if (key === "e" && ctrlKey) {
      e.preventDefault();
      if (localStorage.getItem("eruda-auto-show") === "1") {
        localStorage.setItem("eruda-auto-show", "0");
        eruda.hide();
      } else {
        localStorage.setItem("eruda-auto-show", "1");
        eruda.show();
      }
    }
  });
}
