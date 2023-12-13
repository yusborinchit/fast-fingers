import { parseTo2DigitNumber } from "./parse-to-2-digit-number";

const MINUTES_IN_HOUR = 60;

export function parseTimeToHours({ time }: { time: number }) {
  const hours = Math.floor(time / MINUTES_IN_HOUR);
  const minutes = time % MINUTES_IN_HOUR;

  const hoursDisplay = parseTo2DigitNumber({ number: hours });
  const minutesDisplay = parseTo2DigitNumber({ number: minutes });

  return `${hoursDisplay}:${minutesDisplay}`;
}
