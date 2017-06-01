const moment = require('moment');

/**
 * Points to the latest meteogram for a given location (by {{ID}}).
 */
const baseUrl = 'http://www.meteo.pl/um/php/meteorogram_id_um.php?ntype=0u&id={{ID}}';

/**
 * Point to the historic meteogram if added to the baseUrl.
 */
const historicParamAddition = '&fdate={{TIMESTAMP}}';

/**
 * Hours of measurements (UTC).
 * This is used to determine a point in time of meteogram, see {{TIMESTAMP}} in base url.
 */
const timestamps = ['18', '00', '06', '12', '18'];

/**
 * Generates a timestamp ({{TIMESTAMP}}) based on the fiven datetime.
 * @param {DateTime} datetime
 */
function generateTimestamp(datetime = Date.now()) {
  const day = moment(datetime).utc();
  const h = day.hour() + (day.minute() / 60);
  const q = Math.floor((h + 1) / 6);
  if (q === 0) day.subtract(1, 'day');
  return day.format('YYYYMMDD') + timestamps[q];
}

/**
 * Formats url in order to replace placeholders with actual data.
 * @param {Location} location
 * @param {string} timestamp (Optional) Use if you want to get historc data.
 */
function formatUrl(location, timestamp = '') {
  return (timestamp === '' ? baseUrl : baseUrl + historicParamAddition)
    .replace('{{ID}}', location.id)
    .replace('{{TIMESTAMP}}', timestamp);
}

/**
 * Gets the url to the meteogram for a given location.
 * @param {Location} location
 */
function getMeteogramUrl(location) {
  return formatUrl(location);
}

module.exports = {
  getMeteogramUrl,
};
