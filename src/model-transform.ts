import { DMMF } from "@prisma/generator-helper";
import { enumHelper } from "./enum-helper";
import { formatCode } from "./format";
import { importHelper } from "./import-helper";

function transformType(
  { isList, type, location }: DMMF.OutputTypeRef,
  action: "Create" | "Update"
) {
  let baseType = "";
  let baseJoi = "";

  switch (type) {
    case "String":
      baseType = "string";
      baseJoi = `RuleType.string()`;
      break;
    case "Int":
    case "Float":
      baseType = "number";
      baseJoi = `RuleType.number()`;
      break;
    case "Boolean":
      baseType = "boolean";
      baseJoi = `RuleType.boolean()`;
      break;
    case "DateTime":
      baseType = "Date";
      baseJoi = `RuleType.date()`;
      break;
    case "Json":
      baseType = "any";
      baseJoi = "RuleType.any()";
      break;
    default:
      switch (location) {
        case "enumTypes":
          const enumName = typeof type === "string" ? type : type.name;
          const values = enumHelper.getValues(enumName);

          baseType = enumName;
          baseJoi = `RuleType.string().valid(...${JSON.stringify(values)})`;

          importHelper.add("@prisma/client", enumName);

          break;

        case "outputObjectTypes":
          baseType = type as string;
          baseJoi = `${type}${action}DTO`;

          importHelper.add("@prisma/client", baseType);
          break;
        default:
          baseType = "unknown";
          baseJoi = `RuleType.any()`;
          break;
      }
      break;
  }

  if (isList && baseJoi.endsWith("DTO")) {
    // importHelper.add("@midwayjs/validate", "getSchema");
    // baseJoi = `getSchema(${baseJoi})`;
    return;
  }

  return {
    type: isList ? `${baseType}[]` : baseType,
    joi: isList ? `RuleType.array().items(${baseJoi})` : baseJoi,
  };
}

function transformCreateModel(model: DMMF.OutputType) {
  const { name, fields } = model;

  const str = fields
    .map(({ name, isNullable, outputType }) => {
      if (name === "id") {
        return;
      }

      if (name.startsWith("_")) {
        return;
      }

      const vv = transformType(outputType, "Create");

      if (!vv) {
        return;
      }

      const { type, joi } = vv;

      if (outputType.location === "outputObjectTypes") {
        return `
@Rule(${joi})
${name}${isNullable ? "?" : ""}: ${type}
`;
      }

      return `
@Rule(${joi}${isNullable ? "" : ".required()"})
${name}${isNullable ? "?" : ""}: ${type}
`;
    })
    .filter((v): v is string => {
      return !!v;
    })
    .join("\n\n");

  return `
export class ${name}CreateDTO {
  ${str}
}`;
}

function transformUpdateModel(model: DMMF.OutputType) {
  const { name, fields } = model;

  const str = fields
    .map(({ name, outputType }) => {
      if (name === "id") {
        return;
      }

      if (name.startsWith("_")) {
        return;
      }

      const vv = transformType(outputType, "Update");
      if (!vv) {
        return;
      }
      const { type, joi } = vv;

      return `
      @Rule(${joi})
      ${name}?: ${type}
      `;
    })
    .filter((v) => {
      return !!v;
    })
    .join("\n\n");

  return `
export class ${name}UpdateDTO {
  ${str}
}`;
}

async function transformModelList(modelList: DMMF.OutputType[]) {
  importHelper.add("@midwayjs/validate", "Rule", "RuleType");

  const modelTypes = modelList
    .map((model) => {
      return [transformCreateModel(model), transformUpdateModel(model)];
    })
    .flat()
    .sort((v1, v2) => {
      let nu1 = v1.match(/@Rule\(\s*(?!RuleType)/)?.length ?? 0;
      let nu2 = v2.match(/@Rule\(\s*(?!RuleType)/)?.length ?? 0;

      return nu1 - nu2;
    })
    .join("\n\n\n\n");

  const result = await formatCode(`
    ${importHelper.toString()}

    ${modelTypes}
    `);

  return result;
}

export { transformModelList };
