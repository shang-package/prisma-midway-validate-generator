"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_helper_1 = require("@prisma/generator-helper");
const generator_1 = require("./generator");
(0, generator_helper_1.generatorHandler)({
    onManifest: () => ({
        defaultOutput: "./generated/midway-validate.ts",
        prettyName: "Prisma midway validate generator",
        requiresGenerators: ["prisma-client-js"],
    }),
    onGenerate: generator_1.generate,
});
//# sourceMappingURL=index.js.map