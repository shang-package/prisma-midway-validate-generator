"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const internals_1 = require("@prisma/internals");
const fs_extra_1 = require("fs-extra");
const enum_helper_1 = require("./enum-helper");
const model_transform_1 = require("./model-transform");
async function generate(options) {
    console.log("==================", options.generator.config);
    if (!options.generator.output) {
        return;
    }
    const outputPath = (0, internals_1.parseEnvValue)(options.generator.output);
    const isExists = await (0, fs_extra_1.pathExists)(outputPath);
    if (isExists) {
        const stats = await (0, fs_extra_1.stat)(outputPath);
        if (!stats.isFile()) {
            throw new Error("output need be a file");
        }
    }
    const prismaClientProvider = options.otherGenerators.find((it) => (0, internals_1.parseEnvValue)(it.provider) === "prisma-client-js");
    const dmmf = await (0, internals_1.getDMMF)({
        datamodel: options.datamodel,
        previewFeatures: prismaClientProvider?.previewFeatures,
    });
    enum_helper_1.enumHelper.addList(dmmf.schema.enumTypes.model);
    const modelList = dmmf.schema.outputObjectTypes.model;
    const str = await (0, model_transform_1.transformModelList)(modelList);
    await (0, fs_extra_1.ensureFile)(outputPath);
    await (0, fs_extra_1.writeFile)(outputPath, str);
}
exports.generate = generate;
//# sourceMappingURL=generator.js.map