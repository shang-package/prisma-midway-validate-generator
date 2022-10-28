class EnumHelper {
  private cache: Record<string, string[]> = {};

  public addList(
    list?: {
      name: string;
      values: string[];
    }[]
  ) {
    list?.forEach(({ name, values }) => {
      this.add(name, values);
    });
  }

  public add(name: string, values: string[]) {
    this.cache[name] = values;
  }

  public getValues(name: string) {
    return this.cache[name];
  }
}

const enumHelper = new EnumHelper();

export { enumHelper };
