import esbuild from "esbuild";
import fs from "fs/promises";

const isDev = process.argv.includes("--dev");

async function main() {
  await fs.mkdir("dist", { recursive: true });
  await fs.copyFile("src/manifest.json", "dist/manifest.json");

  const mainBuildAsync = esbuild.build({
    entryPoints: ["src/main.tsx"],
    bundle: true,
    define: {
      "process.env.WEB_URL": isDev ? `"http://localhost:8192"` : `"http://localhost:8192"`,
    },
    format: "esm",
    minify: true,
    watch: process.argv.includes("--dev"),
    outdir: "dist",
  });

  await mainBuildAsync;
}

main();
