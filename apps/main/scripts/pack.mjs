import { exec } from "child_process";
import { promisify } from "util";
import packageJson from "../package.json" assert { type: "json" };

const UNPACKED_OUT_DIR = `dist/unpacked`;

const execAsync = promisify(exec);

async function pack() {
  const outFilename = `pixel-pusher-${packageJson.version}.zip`;
  await execAsync(`zip -r ../${outFilename} .`, { cwd: UNPACKED_OUT_DIR });

  console.log(`[pack] packed: ${outFilename}`);
}

pack();
