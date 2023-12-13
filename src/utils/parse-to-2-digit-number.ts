export function parseTo2DigitNumber({ number }: { number: number }) {
  return number > 10 ? `${number}` : `0${number}`;
}
