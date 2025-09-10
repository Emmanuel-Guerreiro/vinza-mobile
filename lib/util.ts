type FilterRecord = Record<
  string,
  string | number | boolean | undefined | (string | number | boolean)[] | null
>;

export function filtersToSearchParams(filters: FilterRecord): string {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    // Skip undefined, null, empty string, and empty array values
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value) && value.length === 0) return;

    if (Array.isArray(value)) {
      // Handle arrays by serializing them textually
      const validItems = value.filter(
        (item) => item !== undefined && item !== null && item !== "",
      );
      if (validItems.length > 0) {
        const serializedArray = `[${validItems.map((item) => item.toString()).join(",")}]`;
        searchParams.append(key, serializedArray);
      }
    } else {
      // Handle non-array values
      searchParams.append(key, value.toString());
    }
  });

  if (searchParams.toString() === "") {
    return "";
  }

  return `?${searchParams.toString()}`;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
}

export function toTitleCase(str: string) {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1);
}
