import { random } from "lodash";

const MIN_MS_DURATION = 2000;
const MAX_MS_DURATION = 5000;

export function getRandomWait() {
  return random(MIN_MS_DURATION, MAX_MS_DURATION);
}
