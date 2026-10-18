import { readFile, writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

// Keep every browser icon derived from the same navigation mark.
// Run with: node scripts/generate-brand-icons.mjs
const root = new URL("../", import.meta.url);
const logo = await readFile(new URL("static/logo.svg", root), "utf8");
const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();

await writeFile(new URL("static/favicon.svg", root), logo);
await writeFile(new URL("favicon.svg", root), logo);
await writeFile(new URL("static/favicon-32.png", root), render(logo, 32));
// iOS applies its own corner mask to the full-bleed touch icon.
await writeFile(
  new URL("static/apple-touch-icon.png", root),
  render(logo.replace('rx="14"', 'rx="0"'), 180),
);

const sizes = [16, 32, 48];
const frames = sizes.map((size) => render(logo, size));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;

for (const [index, size] of sizes.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = size;
  directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frames[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frames[index].length;
}

await writeFile(new URL("static/favicon.ico", root), Buffer.concat([directory, ...frames]));
console.log("Generated SVG, PNG, ICO (16/32/48px), and Apple touch icons from static/logo.svg.");
