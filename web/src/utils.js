const getRandomNumber = (maxValue) => {
  return Math.floor(Math.random() * maxValue);
};

const getFormattedDuration = (dateTimeInMs) => {
  const durationInSec = (Date.now() - dateTimeInMs) / 1000;
  if (durationInSec < 1) {
    return `now`;
  }
  if (durationInSec < 60) {
    return `${Math.floor(durationInSec)} secs ago`;
  }
  if (durationInSec < 3600) {
    return `${Math.floor(durationInSec / 60)} mins ago`;
  }
  if (durationInSec < 86400) {
    return `${Math.floor(durationInSec / 3600)} hrs ago`;
  }
  if (durationInSec < 604800) {
    return `${Math.floor(durationInSec / 86400)} days ago`;
  }
  if (durationInSec < 2628000) {
    return `${Math.floor(durationInSec / 604800)} weeks ago`;
  }
  if (durationInSec < 31540000) {
    return `${Math.floor(durationInSec / 2628000)} months ago`;
  }
  return `${Math.floor(durationInSec / 31540000)} years ago`;
};

export { getRandomNumber, getFormattedDuration };
