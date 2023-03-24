import type { PercentageType } from '../@types';

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

export function isStrangeString(str: string): boolean {
  const repeatedRegex: RegExp = /(.).*\1/;
  const onlyConsonantRegex: RegExp = /^[^aeiou]+$/i;

  return new RegExp(repeatedRegex.source + '|' + onlyConsonantRegex.source).test(str);
}

export const removeStrangeStrings = (array: string[]) => array.filter(str => !isStrangeString(str));

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function randomPercentForTrue(percentage: PercentageType = 50): boolean {
  return randomNumber(1, 100) <= percentage;
}

export function isArraysEqual(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  const len = a.length || b.length;

  for (let i = 0; i < len; i++) if (a[i] !== b[i]) return false;

  return true;
}

export function isObjEmpty(obj: Object): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
