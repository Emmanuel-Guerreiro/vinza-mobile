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
      // Handle arrays by appending each value separately
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          searchParams.append(key, item.toString());
        }
      });
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
