import { generatorHandler } from "@prisma/generator-helper";
import { generate } from "./generator";

generatorHandler({
  onManifest: () => ({
    defaultOutput: "./generated/midway-validate.ts",
    prettyName: "Prisma midway validate generator",
    requiresGenerators: ["prisma-client-js"],
  }),
  onGenerate: generate,
});
