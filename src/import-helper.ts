class ImportHelper {
  private cache: Record<string, Set<string>> = {};

  public add(from: string, ...names: string[]) {
    if (!this.cache[from]) {
      this.cache[from] = new Set();
    }

    names.forEach((name) => {
      this.cache[from].add(name);
    });
  }

  public remove(from: string, ...names: string[]) {
    if (!this.cache[from]) {
      return;
    }

    names.forEach((name) => {
      this.cache[from].delete(name);
    });
  }

  public toString() {
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

export { importHelper };
