import esbuild from "esbuild";
import fs from "fs/promises";

const isDev = process.argv.includes("--dev");

async function main() {
  await fs.mkdir("dist/unpacked", { recursive: true });
  await fs.copyFile("src/manifest.json", "dist/unpacked/manifest.json");

  const mainBuildAsync = esbuild.build({
    entryPoints: ["src/main.tsx"],
    bundle: true,
    define: {
      "process.env.WEB_URL": isDev ? `"http://localhost:8192"` : `"https://chuanqisun.github.io/pixel-pusher-online/"`,
    },
    format: "esm",
    minify: true,
    watch: process.argv.includes("--dev"),
    outdir: "dist/unpacked",
  });

  await mainBuildAsync;
}

main();
