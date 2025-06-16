import { readdir, rename } from "node:fs/promises";
import { defineConfig } from "tsdown";

const OUT_DIR = "./dist";
export default defineConfig({
  entry: ["./source/index.ts", "./source/otel-api.ts"],
  format: ["cjs", "esm"],

  outputOptions: {
    legalComments: "inline",
    dir: OUT_DIR,
  },

  dts: true,
  treeshake: true,

  hooks: {
    "build:before": async (ctx) => {
      if (ctx.buildOptions.output) {
        // Move each output into its own directory.
        const { format } = ctx.buildOptions.output;
        ctx.buildOptions.output.dir += `/${format}`;
      }
    },

    "build:done": async (_) => {
      // For some reason the types for CJS are being placed out of the CJS directory.
      // This is a workaround to move them into the CJS directory.
      const files = await readdir(OUT_DIR);
      const ctsFiles = files.filter((file) => file.endsWith(".d.cts"));

      for (const file of ctsFiles) {
        const sourcePath = `${OUT_DIR}/${file}`;
        const targetPath = `${OUT_DIR}/cjs/${file}`;

        await rename(sourcePath, targetPath);
      }
    },
  },
});
