import esbuild from "esbuild";
import fs from "fs/promises";

async function main() {
  const mainBuildAsync = esbuild.build({
    entryPoints: ["src/main/main.tsx"],
    bundle: true,
    format: "esm",
    sourcemap: false, // TODO can this work?
    minify: true, // TODO
    outdir: "dist",
  });

  const uiScriptBuildOutAsync = esbuild.build({
    entryPoints: ["src/ui/ui.ts"],
    bundle: true,
    format: "esm",
    sourcemap: "inline", // TODO perf?
    minify: true, // TODO perf?
    write: false,
  });

  const uiStyleBuildOutAsync = esbuild.build({
    entryPoints: ["src/ui/ui.css"],
    bundle: true,
    sourcemap: "inline",
    minify: true,
    write: false,
  });

  const [uiScriptBuildOut, uiStyleBuildOut] = await Promise.all([uiScriptBuildOutAsync, uiStyleBuildOutAsync]);

  outputHtml(uiScriptBuildOut.outputFiles[0].text, uiStyleBuildOut.outputFiles[0].text);

  await mainBuildAsync;
}

async function outputHtml(scriptOuput, styleOutput) {
  const templateHmlt = await fs.readFile("src/ui/ui.html", "utf-8");
  const resultHtml = templateHmlt
    .replace("<!-- SCRIPT_OUTPUT -->", `<script type="module">${scriptOuput}</script>`)
    .replace("<!-- STYLE_OUTPUT -->", `<style>${styleOutput}</style>`);
  await fs.mkdir("dist", { recursive: true });
  await fs.writeFile("dist/ui.html", resultHtml);
}

main();
