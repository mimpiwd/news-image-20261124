// 24 November 2026 in One Image — copies entry.png to the output directory.
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1024 * 1024; // entry.png must stay at or under 1 MiB

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
// A relative output dir is resolved against the repository root, so a
// caller passing e.g. MAKEFUN_OUTPUT_DIR=out always lands in a known place.
const outDirRaw = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outDir = outDirRaw.startsWith("/") ? outDirRaw : join(here, outDirRaw);

if (!existsSync(source)) {
  throw new Error("entry.png is missing from the repository root");
}
if (statSync(source).size > MAX_BYTES) {
  throw new Error("entry.png is over the 1 MiB size limit");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "entry.png"));
console.log("entry.png copied to " + outDir);
