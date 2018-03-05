'use strict';

var HypergridError = require('../lib/error');

/**
 * @namespace
 */
var dataModels = {
    HeaderSubgrid: require('./HeaderSubgrid')
};

// add and get are non-enumerable
Object.defineProperties(dataModels, {
    /**
     * @function
     * @memberOf dataModels
     * @summary Register a data model by name.
     */
    add: {
        value: function(name, Constructor) {
            if (typeof name === 'function') {
                Constructor = name;
                name = undefined;
            }

            name = name ||
                Constructor.prototype.$$CLASS_NAME ||
                Constructor.prototype.name ||
                Constructor.name;

            if (!name) {
                throw new HypergridError('Cannot register a data model without a name.')
            }

            this[name] = Constructor;
        }
    },
    /**
     * @function
     * @memberOf dataModels
     * @summary Lookup a registered data model by name.
     */
    get: {
        value: function(name) {
            return this[name];
        }
    },
    /**
     * @type {string[]}
     * @memberOf dataModels
     * @summary Array of names of registered data models.
     */
    keys: {
        get: function() {
            return Object.keys(this);
        }
    }
});

module.exports = dataModels;
