
// --------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------

var osname = Ti.Platform.osname,
    ANDROID = (osname === 'android'),
    IOS = (osname === 'iphone' || osname === 'ipad');

var rows = [
    {
        title: 'isGooglePlayServicesAvailable() (Android)',
        onClick: function(){
            logInApp('isGooglePlayServicesAvailable: ' + Geofence.isGooglePlayServicesAvailable());
        }
    },
    {
        title: 'regionMonitoringAvailable() (iOS)',
        onClick: function(){
            logInApp('regionMonitoringAvailable: ' + Geofence.regionMonitoringAvailable());
        }
    },
    {
        title: 'createRegion()',
        onClick: function(){
            var region = Geofence.createRegion({
                center: { 
                    latitude:37.389601,
                    longitude:-122.050169
                },
                radius:10,
                identifier:'Appcelerator'
            });
            logInApp('REGION: ' + region + ' with identifier: ' + region.identifier);
        }
    },
    {
        title: 'containsCoordinate() (iOS)',
        onClick: function(){
            var region = Geofence.createRegion({
                center: { 
                    latitude:37.389601,
                    longitude:-122.050169
                },
                radius:10,
                identifier:'Appcelerator'
            });
            // Should be true
            logInApp('containsCoordinate: ' + region.containsCoordinate({
                latitude:37.388657,
                longitude:-122.050831
            }));
        }
    },
    {
        title: 'startMonitoringForRegions() I280',
        onClick: function(){
            logInApp('startMonitoringForRegions() I280');
            var region = Geofence.createRegion({
                center: { 
                    latitude:37.335275,
                    longitude:-122.032547
                },
                radius:500.0,
                identifier:'Test1'
            });
            var region2 = Geofence.createRegion({
                center: { 
                    latitude:37.371173,
                    longitude:-122.142763
                },
                radius:1000,
                identifier:'Test2'
            });
            Geofence.startMonitoringForRegions([region, region2]);

        }
    },
    {
        title: 'startMonitoringForRegions() appc',
        onClick: function(){
            logInApp('startMonitoringForRegions() appc');
            var appc = Geofence.createRegion({
                center: { 
                    latitude:37.389601,
                    longitude:-122.050169
                },
                radius:20,
                identifier:'Appcelerator'
            });
            Geofence.startMonitoringForRegions(appc);
        }
    },
    {
        title: 'stopMonitoringForRegions()',
        onClick: function(){
            logInApp('stopMonitoringForRegions()');
            var region = Geofence.createRegion({
                center: { 
                    latitude:37.335275,
                    longitude:-122.032547
                },
                radius:500,
                identifier:'Test1'
            });
            var region2 = Geofence.createRegion({
                center: { 
                    latitude:37.371173,
                    longitude:-122.142763
                },
                radius:1000,
                identifier:'Test2'
            });
            Geofence.stopMonitoringForRegions([region, region2]);
        }
    },
    {
        title: 'stopMonitoringAllRegions()',
        onClick: function(){
            logInApp('stopMonitoringAllRegions()');
            Geofence.stopMonitoringAllRegions();
        }
    },
    {
        title: 'monitoredRegions (iOS)',
        onClick: function(){
            logInApp('monitoredRegions length: ' + Geofence.monitoredRegions.length);
        }
    }
];

// Clear app badge when the app is opened
if (IOS) {
    Ti.UI.iPhone.appBadge = 0;
    Ti.App.addEventListener('resume', function() {
        Ti.UI.iPhone.appBadge = 0;
    });
}
function incrementAppBadge() {
    IOS && Ti.UI.iPhone.appBadge++;
}

var Geofence = require('ti.geofence');

// --------------------------------------------------------------------
// Geofence Event Listners
// --------------------------------------------------------------------

Geofence.addEventListener('error', function(e) {
    logInApp('####### ERROR #######: ' + JSON.stringify(e));
});

Geofence.addEventListener('enterregions', function(e) {
    logInApp('####### enterregion #######: ' + JSON.stringify(e));
    for (var i = 0, j = e.regions.length; i < j; i++) {
        logInApp('Region id: ' + e.regions[i].identifier);
        incrementAppBadge();
    }
});

Geofence.addEventListener('exitregions', function(e) {
    logInApp('####### exitregion #######: ' + JSON.stringify(e));
    for (var i = 0, j = e.regions.length; i < j; i++) {
        logInApp('Region id: ' + e.regions[i].identifier);
        incrementAppBadge();
    }
});

Geofence.addEventListener('monitorregions', function(e) {
    // Triggered when new regions are added to be monitored
    logInApp('####### monitorregion #######: ' + JSON.stringify(e));
    for (var i = 0, j = e.regions.length; i < j; i++) {
        logInApp('Region id: ' + e.regions[i].identifier);
    }
});

// --------------------------------------------------------------------
// UI
// --------------------------------------------------------------------

var win = Ti.UI.createWindow({
    backgroundColor: 'white'
});

var textLog = Ti.UI.createTextArea({
    top: 0,
    height: '20%',
    width: '100%',
    borderWidth: '2',
    borderColor: '#000',
    value: 'AppLog: this log scrolls backwards (newest === top)'
});
win.add(textLog);

var tableView = Ti.UI.createTableView({
    top: '20%',
    data: rows
});
tableView.addEventListener('click', function(e){
    rows[e.index].onClick && rows[e.index].onClick();
});
win.add(tableView);

function logInApp(text) {
    textLog.value = text + '\n' + textLog.value;
    Ti.API.info(text);
}

win.open();

