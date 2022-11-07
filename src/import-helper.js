"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importHelper = void 0;
class ImportHelper {
    cache = {};
    add(from, ...names) {
        if (!this.cache[from]) {
            this.cache[from] = new Set();
        }
        names.forEach((name) => {
            this.cache[from].add(name);
        });
    }
    remove(from, ...names) {
        if (!this.cache[from]) {
            return;
        }
        names.forEach((name) => {
            this.cache[from].delete(name);
        });
    }
    toString() {
        return Object.entries(this.cache)
            .map(([from, names]) => {
            const nameStr = [...names.values()].join(", ");
            return `// eslint-disable-next-line @typescript-eslint/no-unused-vars
        import { ${nameStr} } from '${from}'`;
        })
            .join("\n");
    }
}
const importHelper = new ImportHelper();
exports.importHelper = importHelper;
//# sourceMappingURL=import-helper.js.map