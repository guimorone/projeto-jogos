export function formatNumber(
  value: number,
  style: 'decimal' | 'currency' | 'percent' | 'unit' = 'decimal',
  format: string = 'pt-BR',
  currency: string = 'BRL'
): string {
  const moreOptions: {
    minimumFractionDigits: number | undefined;
    maximumFractionDigits: number | undefined;
    minimumSignificantDigits: number | undefined;
    maximumSignificantDigits: number | undefined;
  } = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
    minimumSignificantDigits: style !== 'currency' ? 1 : undefined,
    maximumSignificantDigits: style !== 'currency' ? 20 : undefined,
  };

  return new Intl.NumberFormat(format, {
    style,
    currency,
    ...moreOptions,
  }).format(value);
}

export async function asyncReadLocalTxtFile(filePath: string, splitStr: string = '\n'): Promise<any> {
  let res;

  await fetch(filePath)
    .then(response => response.text())
    .then(text => (res = splitStr ? text.split(splitStr) : text));

  return res;
}
