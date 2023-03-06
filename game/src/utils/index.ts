export async function asyncReadLocalTxtFile(filePath: string, splitStr: string = '\n'): Promise<any> {
  let res;

  await fetch(filePath)
    .then(response => response.text())
    .then(text => (res = splitStr ? text.split(splitStr) : text));

  return res;
}
