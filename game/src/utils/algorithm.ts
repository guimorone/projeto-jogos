import { normalizeValue } from '.';

export const handleChangeWord = (
  wordWritten: string,
  wordsList: string[],
  normalizeWord: boolean = false
): { prefixList: string[]; suffixList: string[] } => {
  const word: string = normalizeWord ? normalizeValue(wordWritten) : wordWritten;

  const prefixList: string[] = [];
  const suffixList: string[] = [];

  wordsList.forEach((w: string) => {
    const wordCurrent: string = normalizeWord ? normalizeValue(w) : w;

    if (wordCurrent.substring(0, word.length) === word) {
      prefixList.push(word);
      suffixList.push(wordCurrent.substring(word.length, wordCurrent.length));
    } else {
      prefixList.push('');
      suffixList.push(wordCurrent);
    }
  });

  return { prefixList, suffixList };
};
