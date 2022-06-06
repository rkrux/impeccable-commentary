const getRandomNumber = (maxValue) => {
  return Math.floor(Math.random() * maxValue);
};

const pluralize = (value, suffix) =>
  value > 1 ? `${value} ${suffix}s` : `${value} ${suffix}`;

const getFormattedDuration = (dateTimeInMs) => {
  const durationInSec = (Date.now() - dateTimeInMs) / 1000;
  if (durationInSec < 1) {
    return `now`;
  }
  if (durationInSec < 60) {
    return `${pluralize(Math.floor(durationInSec), 'sec')} ago`;
  }
  if (durationInSec < 3600) {
    return `${pluralize(Math.floor(durationInSec / 60), 'min')} ago`;
  }
  if (durationInSec < 86400) {
    return `${pluralize(Math.floor(durationInSec / 3600), 'hour')} ago`;
  }
  if (durationInSec < 604800) {
    return `${pluralize(Math.floor(durationInSec / 86400), 'day')} ago`;
  }
  if (durationInSec < 2628000) {
    return `${pluralize(Math.floor(durationInSec / 604800), 'week')} ago`;
  }
  if (durationInSec < 31540000) {
    return `${pluralize(Math.floor(durationInSec / 2628000), 'month')} ago`;
  }
  return `${pluralize(Math.floor(durationInSec / 31540000), 'year')} ago`;
};

export { getRandomNumber, getFormattedDuration };
