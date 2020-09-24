import { random } from "lodash";

const MIN_MS_DURATION = 2000;
const MAX_MS_DURATION = 5000;

function getRandomWait() {
  return random(MIN_MS_DURATION, MAX_MS_DURATION);
}

export function wait(duration?: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration ?? getRandomWait());
  });
}
