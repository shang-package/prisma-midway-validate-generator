declare class EnumHelper {
    private cache;
    addList(list?: {
        name: string;
        values: string[];
    }[]): void;
    add(name: string, values: string[]): void;
    getValues(name: string): string[];
}
declare const enumHelper: EnumHelper;
export { enumHelper };
//# sourceMappingURL=enum-helper.d.ts.map