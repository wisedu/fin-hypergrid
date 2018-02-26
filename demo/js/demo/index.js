/* eslint-env browser */

/* globals fin, people1 */

/* eslint-disable no-alert*/

'use strict';

window.onload = function() {

    var demo = window.demo = {
        set vent(start) { window.grid[start ? 'logStart' : 'logStop'](); },
        reset: reset,
        setData: setData,
        toggleEmptyData: toggleEmptyData,
        resetData: resetData
    };

    var Hypergrid = fin.Hypergrid,
        getSchema = require('fin-hypergrid-field-tools').getSchema,
        initState = require('./setState'),
        initCellRenderers = require('./cellrenderers'),
        initFormatters = require('./formatters'),
        initCellEditors = require('./celleditors'),
        initDashboard = require('./dashboard'),
        initEvents = require('./events');

    document.getElementById('version').innerText = Hypergrid.prototype.version;

    var gridOptions = {
            // Because v3 defaults to use datasaur-local (which is still included in the build),
            // specifying it here is still optional, but may be required for v4.
            // Uncomment one of the following 2 lines to specify ("bring your own") data source:

            // dataModel: new (Hypergrid.require('datasaur-local'))(people1, getSchema(people1)),
            // DataModel: Hypergrid.require('datasaur-local'),

            data: people1,
            margin: { bottom: '17px', right: '17px' },
            plugins: require('fin-hypergrid-event-logger'),
            schema: getSchema(people1),
            state: { color: 'orange' }
        },
        grid = window.grid = window.g = new Hypergrid('div#json-example', gridOptions),
        behavior = grid.behavior,
        dataModel = behavior.dataModel;

    Object.defineProperties(window, {
        b: { get: function() { return grid.behavior; } },
        m: { get: function() { return grid.behavior.dataModel; } }
    });

    console.log('schema', behavior.schema);

    function setData(data, options) {
        options = !data.length ? undefined : options || {
            schema: getSchema(data)
        };
        grid.setData(data, options);
    }

    function reset() {
        grid.reset();
        initEvents(demo, grid);
    }

    var oldData;
    function toggleEmptyData() {
        if (!oldData) {
            oldData = {
                data: dataModel.data,
                schema: behavior.schema,
                activeColumns: behavior.getActiveColumns().map(function(column) { return column.index; })
            };
            //important to set top totals first
            setData([]);
        } else {
            //important to set top totals first
            setData(oldData.data, oldData.schema);
            behavior.setColumnIndexes(oldData.activeColumns);
            oldData = undefined;
        }
    }

    function resetData() {
        setData(people1);
        initState(demo, grid);
    }

    initCellRenderers(demo, grid);
    initFormatters(demo, grid);
    initCellEditors(demo, grid);
    initEvents(demo, grid);
    initDashboard(demo, grid);
    initState(demo, grid);

    // Following would be needed for row height changes made in data model subrows POC:
    // setTimeout(function() { grid.behaviorStateChanged(); });
};
