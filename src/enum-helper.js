"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumHelper = void 0;
class EnumHelper {
    cache = {};
    addList(list) {
        list?.forEach(({ name, values }) => {
            this.add(name, values);
        });
    }
    add(name, values) {
        this.cache[name] = values;
    }
    getValues(name) {
        return this.cache[name];
    }
}
const enumHelper = new EnumHelper();
exports.enumHelper = enumHelper;
//# sourceMappingURL=enum-helper.js.map