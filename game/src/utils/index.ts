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

export function classNames(...classes: any[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getWindowDimensions(): { width: number; height: number } {
  const { innerWidth: width, innerHeight: height } = window;

  return { width, height };
}

export const removeAccentsOrDiacriticsInString = (str: string, form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD' = 'NFD'): string =>
  typeof str === 'string' ? str.normalize(form).replace(/[\u0300-\u036f]/g, '') : str;

export const normalizeValue = (value: string | number): string =>
  typeof value === 'string' ? removeAccentsOrDiacriticsInString(value.trim().toLowerCase()) : value.toString();

export async function asyncReadLocalTxtFile(filePath: string, splitStr: string = '\n'): Promise<any> {
  let res;

  await fetch(filePath)
    .then(response => response.text())
    .then(text => (res = splitStr ? text.split(splitStr) : text));

  return res;
}

export const uniqueArray = (a: any[]): any[] => [...new Set(a)];

export function shuffleArray(array: any[]): any[] {
  for (let currentIndex = array.length - 1; currentIndex >= 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    // swap
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

