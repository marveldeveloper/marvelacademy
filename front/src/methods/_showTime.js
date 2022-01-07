import { showNumber } from ".";
export default function showTime(val = 0) {
  const hour = Math.floor(val / 60);
  const min = val % 60;
  return `${showNumber(hour)}:${showNumber(min)}`;
}
