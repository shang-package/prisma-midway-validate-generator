import { GeneratorOptions } from "@prisma/generator-helper";
import { getDMMF, parseEnvValue } from "@prisma/internals";
import { remove, stat, writeFile } from "fs-extra";
import { enumHelper } from "./enum-helper";
import { transformModelList } from "./model-transform";

async function generate(options: GeneratorOptions) {
  if (!options.generator.output) {
    return;
  }

  const outputPath = parseEnvValue(options.generator.output);

  const stats = await stat(outputPath);

  if (stats.isDirectory()) {
    throw new Error("output need be file, not directory");
  }

  const prismaClientProvider = options.otherGenerators.find(
    (it) => parseEnvValue(it.provider) === "prisma-client-js"
  );

  const dmmf = await getDMMF({
    datamodel: options.datamodel,
    previewFeatures: prismaClientProvider?.previewFeatures,
  });

  enumHelper.addList(dmmf.schema.enumTypes.model);

  const modelList = dmmf.schema.outputObjectTypes.model;

  const str = await transformModelList(modelList);

  await remove(outputPath);
  await writeFile(outputPath, str);
}

export { generate };
