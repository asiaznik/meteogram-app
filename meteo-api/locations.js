/**
 * Loads all supported locations.
 */
const locations = require('./locations.data');

/**
 * Searches for the location by the given name.
 * Search results are limited to the list of supported locations (see locations.data.json).
 * @param {string} name
 */
function search(name) {
  return locations.filter(x => x.name.toUpperCase().startsWith(name.toUpperCase()));
}

/**
 * Default locations (available by default).
 */
const defaultLocations = [
  { id: '511', name: 'Kraków' },
];

module.exports = {
  allLocations: locations,
  defaultLocations,
  search,
};
