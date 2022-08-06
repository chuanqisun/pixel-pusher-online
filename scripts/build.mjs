import esbuild from "esbuild";
import fs from "fs/promises";

const isWatch = process.argv.includes("--watch");

async function main() {
  await esbuild.build({
    entryPoints: ["src/main/main.tsx"],
    bundle: true,
    format: "esm",
    sourcemap: "inline", // TODO perf?
    watch: false, // TODO
    minify: false, // TODO
    watch: isWatch
      ? {
          onRebuild(error) {
            if (error) {
              console.error(error);
            } else {
              console.log("rebuilt main");
            }
          },
        }
      : false,
    outdir: "dist",
  });

  const uiBuildOut = await esbuild.build({
    entryPoints: ["src/ui/ui.ts"],
    bundle: true,
    format: "esm",
    sourcemap: "inline", // TODO perf?
    watch: false, // TODO
    minify: false, // TODO
    write: false,
    watch: isWatch
      ? {
          onRebuild(error, result) {
            if (error) {
              console.error(error);
            } else {
              const jsString = result.outputFiles[0].text;
              outputUIScript(jsString);
              console.log("rebuilt UI");
            }
          },
        }
      : false,
  });

  const jsString = uiBuildOut.outputFiles[0].text;
  outputUIScript(jsString);
}

async function outputUIScript(script) {
  const templateHmlt = await fs.readFile("src/ui/ui.html", "utf-8");
  const resultHtml = templateHmlt.replace("<!-- BUILD_OUTPUT -->", `<script type="module">${script}</script>`);
  await fs.mkdir("dist", { recursive: true });
  await fs.writeFile("dist/ui.html", resultHtml);
}

main();
