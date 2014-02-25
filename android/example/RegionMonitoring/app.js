// --------------------------------------------------------------------
// SETUP
// --------------------------------------------------------------------

// Some setup is required for this example to work correctly.
// 1. Enable ACS for your Titanium app.
//      * Follow these instructions if necessary
//        http://docs.appcelerator.com/cloud/latest/#!/guide/acs_quickstart
// 2. Get the 'APP Key' for your app from the 'tiapp.xml' or under
//    App Management on ACS and use it to replace <YOUR APP APP KEY> in the 
//    following curl commands.
// 3. Run following curl commands from the terminal.
//    Login (you will need to create a user and pass the correct login and password): 
//     curl -b cookies.txt -c cookies.txt -F "login=jalter" -F "password=pass" https://api.cloud.appcelerator.com/v1/users/login.json?key=<YOUR APP APP KEY>
//    Create Places:
//     curl -X POST -b cookies.txt -c cookies.txt -F 'geo_fence={"loc":{"coordinates":[-122.032547,37.335275], "radius":"2000/6378137"}, "payload":{"name":"280T1-1"}}' "http://api.cloud.appcelerator.com/v1/geo_fences/create.json?key=<YOUR APP APP KEY>"
//     curl -X POST -b cookies.txt -c cookies.txt -F 'geo_fence={"loc":{"coordinates":[-122.056827,37.332362], "radius":"2000/6378137"}, "payload":{"name":"280T1-2"}}' "http://api.cloud.appcelerator.com/v1/geo_fences/create.json?key=<YOUR APP APP KEY>"
//     curl -X POST -b cookies.txt -c cookies.txt -F 'geo_fence={"loc":{"coordinates":[-122.074176,37.334737], "radius":"2000/6378137"}, "payload":{"name":"280T1-3"}}' "http://api.cloud.appcelerator.com/v1/geo_fences/create.json?key=<YOUR APP APP KEY>"
//     curl -X POST -b cookies.txt -c cookies.txt -F 'geo_fence={"loc":{"coordinates":[-122.099634,37.346764], "radius":"2000/6378137"}, "payload":{"name":"280T1-4"}}' "http://api.cloud.appcelerator.com/v1/geo_fences/create.json?key=<YOUR APP APP KEY>"
// 4. Run your application.
// 5. Follow one of the steps under the `Testing` section of the module's documentation for testing
//      * Since the above locations are on the beginning of the route starting at N. DeAnza Blvd 
//        and I280 and travels north on I280, you can use `Freeway Drive` or the GPX file included
//        in the `examples/MockLocationData` folder to test these locations easily.
//      * NOTE: It is very easy for a device to miss a region entirely do to moving through it quickly.

// --------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------

function isIOS7Plus() {
    if (Titanium.Platform.name == 'iPhone OS')
    {
        var version = Titanium.Platform.version.split('.');
        var major = parseInt(version[0],10);
 
        if (major >= 7) {
            return true;
        }
    }
    return false;
}
var osname = Ti.Platform.osname,
    ANDROID = (osname === 'android'),
    IOS = (osname === 'iphone' || osname === 'ipad'),
    IOS7PLUS = isIOS7Plus(),
    defaultFontSize = ANDROID ? '16dp' : 14;

// Modules
var Cloud = require('ti.cloud');
var Geofence = require('ti.geofence');

// --------------------------------------------------------------------
// Tests as Table View Rows
// --------------------------------------------------------------------

var rows = [
    {
        title: 'fetchNewFences',
        onClick: function(){
            fetchNewFences();
        }
    },
    {
        title: 'Stop Refresh Timer',
        onClick: function(){
            logInApp('Stop Refresh Timer');
            clearInterval(refreshTimer);
        }
    }
];

// --------------------------------------------------------------------
// UI
// --------------------------------------------------------------------

var win = Ti.UI.createWindow({
    backgroundColor: 'white'
});

var scrollView =  Ti.UI.createScrollView({
    top: IOS7PLUS ? 20 : 0,
    bottom: '60%',
    width: '100%',
    borderWidth: '2',
    borderColor: '#000',
    color: '#000',
    backgroundColor: '#FFF'
});
var textLog = Ti.UI.createLabel({
    top: 0,
    left: 5,
    font: {
        fontSize: defaultFontSize
    },
    text: 'AppLog: see the console log for more details'
});
win.add(scrollView);
scrollView.add(textLog);
 
if (ANDROID) {
    for (var i = 0, j = rows.length; i < j; i++) {
        rows[i].font = {fontSize: defaultFontSize};
        rows[i].height = '50dp';
        rows[i].color = '#000';
    }
}

var tableView = Ti.UI.createTableView({
    height: '60%',
    bottom: 0,
    data: rows
});
tableView.addEventListener('click', function(e){
    rows[e.index].onClick && rows[e.index].onClick();
});
win.add(tableView);

var scrollViewHeight;
scrollView.addEventListener('postlayout', function(){
    scrollViewHeight = scrollView.rect.height;
});
// Scroll as more text is added to the log label
textLog.addEventListener('postlayout', function(){
    var sHeight = scrollViewHeight,
        tHeight = textLog.rect.height;
    if (tHeight > sHeight) {
        scrollView.setContentOffset({
            x: 0, y: tHeight - sHeight
        }, false);
    }
});

win.open();
 
// Util - Logs in app and console
function logInApp(text) {
    textLog.text = textLog.text + '\n' + text;
    Ti.API.info(text);
}

// --------------------------------------------------------------------
// Geofence Event Listners
// --------------------------------------------------------------------

Geofence.addEventListener('error', function(e) {
    logInApp('####### ERROR #######: ' + JSON.stringify(e));
});

Geofence.addEventListener('enterregions', function(e) {
    logInApp('####### enterregion #######: ' + JSON.stringify(e));
    // Only the region's `identifier` is returned.
    // Use the `identifier` to look up the rest of the region's data.
    var regionData;
    for (var i = 0, j = e.regions.length; i < j; i++) {
        regionData = activeRegionData[e.regions[i].identifier];
        logInApp('Region: ' + e.regions[i].identifier + ' @ ' + regionData.loc.coordinates[1] + ',' + regionData.loc.coordinates[0]);

        // Display local notification
        showNotification({
            title: 'ENTER',
            body: 'enter - ' + e.regions[i].identifier
        });
    }
});

Geofence.addEventListener('exitregions', function(e) {
    logInApp('####### exitregion #######: ' + JSON.stringify(e));

    var regionData;
    for (var i = 0, j = e.regions.length; i < j; i++) {
        regionData = activeRegionData[e.regions[i].identifier];
        logInApp('Region: ' + e.regions[i].identifier + ' @ ' + regionData.loc.coordinates[1] + ',' + regionData.loc.coordinates[0]);

        // Display local notification
        showNotification({
            title: 'EXIT',
            body: 'exit - ' + e.regions[i].identifier
        });
    }
});

Geofence.addEventListener('monitorregions', function(e) {
    // Triggered when new regions are added to be monitored
    logInApp('####### monitorregion #######: ' + JSON.stringify(e));
    for (var i = 0, j = e.regions.length; i < j; i++) {
        logInApp('Region id: ' + e.regions[i].identifier);
    }
});

Geofence.addEventListener('removeregions', function(e) {
    // Triggered on Android when regions are removed and are no longer being monitored
    logInApp('####### removeregions #######: ' + JSON.stringify(e));

    onRegionsRemoved && onRegionsRemoved();
    onRegionsRemoved = null;
});

// --------------------------------------------------------------------
// Geofencing
// --------------------------------------------------------------------

// How often to pull new regions from the server
var REFRESH_HOURS = 24,
    REFRESH_MINUTES = 60,
    REFRESH_SECONDS = 60,
    REFRESH_MILLISECONDS = 1000,
    REFRESH_INTERVAL = REFRESH_HOURS * REFRESH_MINUTES * REFRESH_SECONDS * REFRESH_MILLISECONDS;

// Name of file where data for currently monitored regions is persisted
var ACTIVE_REGIONS_FILENAME = 'activeRegions.json';
var activeRegionData = readActiveRegionsDataFromFile();
var refreshTimer;
var onRegionsRemoved = null;

// Setup
Ti.Geolocation.purpose = 'testing'; // Required

// Region Refresh Timer callback
function refreshRegions() {
    logInApp('refreshRegions @ ' + new Date().toTimeString());
    fetchNewFences();
}

if ((IOS && Geofence.regionMonitoringAvailable()) ||
     (ANDROID && Geofence.isGooglePlayServicesAvailable() === Geofence.SUCCESS))  {
    // On Start: Refresh regions and start timer for next refresh
    refreshRegions();
    refreshTimer = setInterval(refreshRegions, REFRESH_INTERVAL);
    logInApp('Started Region Refresh Timer');
} else {
    logInApp('Region Monitoring not available on this device');
}

// Clear app badge when the app is opened
if (IOS) {
    Ti.UI.iPhone.appBadge = 0;
    Ti.App.addEventListener('resume', function() {
        Ti.UI.iPhone.appBadge = 0;
    });
}

var locationRetries = 1;
function fetchNewFences(args) {
    args = args || {};

    var lastGeo = Ti.Geolocation.lastGeolocation, // String
        lastGeolocation = args.lastGeolocation || (lastGeo ? JSON.parse(lastGeo) : null);

    Ti.API.info('fetchNewFences(' + JSON.stringify(args) + ')');

    // A location is needed in order to get local regions
    if (!lastGeolocation) {
        Ti.API.info('!lastGeolocation');

        Ti.Geolocation.getCurrentPosition(function(e) {
            if (!e.success || e.error) {
                logInApp('Error getting current position: ' + JSON.stringify(e));
                return;
            }

            // Now that we have a location, lets try again
            fetchNewFences({
                lastGeolocation: e.coords
            });
        });

        return;
    }

    Cloud.GeoFences.query({
        response_json_depth: 1,
        where:{ 
            'loc': {
                '$nearSphere' : { 
                    '$geometry' : { 
                        'type' : 'Point' ,
                        'coordinates' : [lastGeolocation.longitude,lastGeolocation.latitude]
                    }
                }
            }
        }
    }, function (e) {
        if (e.success) {
            if (e.geo_fences.length === 0) {
                logInApp('No GeoFences found');
            }
            else {
                logInApp('Found GeoFences');
                for (var i = 0, l = e.geo_fences.length; i < l; i++) {
                    logInApp('Name: ' + e.geo_fences[i].payload.name);
                }

                // Process geo_fences and start monitoring their regions
                processFences(e.geo_fences);
            }
        } else {
            logInApp('ERROR: ' + JSON.stringify(e));
        }
    });
}

function processFences(fences) {
    Ti.API.info('processFences(' + fences + ')');

    if (!fences || fences.length === 0) {
        return null;
    }

    var region,
        regions = [],
        fence,
        fencesDict = {};

    for (var i = 0, j = fences.length; i < j; i++) {
        fence = fences[i];
        region = Geofence.createRegion({
            center: { 
                latitude: fence.loc.coordinates[1],
                longitude: fence.loc.coordinates[0]
            },
            // A region's radius is measured in meters
            // A geo_fence's radius is based on the radius of the earth
            // e.g) To give a 2000 meters of radius, it should be 2000 / 6378137, 
            // where denominator 6378137 is the radius of earth in meters.
            // Another example: 10 / 3959 is the radius of 10 miles where 
            // denominator 3959 is the radius of earth in miles.
            // Because of this we must eval the radius as it is something
            // like "2000/6378137".
            radius: 6378137 * eval(fence.loc.radius),
            notifyOnEntry: true,
            notifyOnExit: true,
            // The `identifier` must be unique
            identifier: fence.payload.name
        });
        regions.push(region);
        // Only a Region's `identifier` can be read back from a region
        // Save each fence's data so it can be looked up later using the `identifier`
        fencesDict[fence.payload.name] = fence;

        // There is a limit to the number of regions that can be
        // monitored at once this limit is enforced by the platform
        // iOS = 20 Regions
        // Android = 100 Regions
        if ((IOS && i >= 19) || (ANDROID && i >= 99)) {
            break;
        }
    }

    // Remove old regions and start monitoring the new regions
    replaceMonitoredRegions({
        regionData: fencesDict,
        regions: regions
    });
}

function replaceMonitoredRegions(args) {
    args = args || {};
    var regions = args.regions, 
        regionData = args.regionData;

    // Must remove all old regions before adding new ones
    Geofence.stopMonitoringAllRegions();

    if (ANDROID) {
        // On Android stopMonitoringAllRegions() is asynchronous
        // must listen for the 'removeregions' event before monitoring new regions
        onRegionsRemoved = function() {
            monitorNewRegions(args);
        };
    } else if (IOS) {
        monitorNewRegions(args);
    } else {
        Ti.API.info('Can not replaceMonitoredRegions on unsupported platform `' + osname + '`');
    }
}

function monitorNewRegions(args) {
    args = args || {};
    var regions = args.regions, 
        regionData = args.regionData;

    // Start monitoring new regions
    Geofence.startMonitoringForRegions(regions);

    // Save regionData to file for later
    saveActiveRegionsDataToFile(regionData);

    // Update Active Region data
    activeRegionData = regionData;
}


// --------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------

function saveActiveRegionsDataToFile(regionData) {
    Ti.API.info('saveActiveRegionsDataToFile()');

    var file;

    if (!regionData) {
        Ti.API.info('No regionData to save');
        return;
    }

    file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, ACTIVE_REGIONS_FILENAME);
    if (!file.exists()) {
        Ti.API.info('No `' + ACTIVE_REGIONS_FILENAME + '` file found');
    }

    Ti.API.info('Saving regionData to file `' + ACTIVE_REGIONS_FILENAME + '`');

    file.write(JSON.stringify(regionData));
}

function readActiveRegionsDataFromFile() {
    Ti.API.info('readActiveRegionsDataFromFile()');

    var file, regionData;

    file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, ACTIVE_REGIONS_FILENAME);
    if (!file.exists()) {
        Ti.API.info('No `' + ACTIVE_REGIONS_FILENAME + '` file found');
        return;
    }

    Ti.API.info('Reading regionData from file `' + ACTIVE_REGIONS_FILENAME + '`');

    try {
        regionData = JSON.parse(file.read());
    } catch (e) {
        throw new Error('Invalid `' + ACTIVE_REGIONS_FILENAME + '` file');
    }

    return regionData;
}

var notificationCount = 1;
function showNotification(params) {
    var params = params || {},
        title = params.title || '',
        body = params.body || '';

    if (ANDROID) {
        var activity = Ti.Android.currentActivity;
        var intent = Ti.Android.createIntent({
            action: Ti.Android.ACTION_MAIN,
            // you can use className or url to launch the app
            // className and packageName can be found by looking in the build folder
            // for example, mine looked like this
            // build/android/gen/com/appcelerator/test/Test7Activity.java
            // className : 'com.appcelerator.test.Test7Activity',
     
            // if you use url, you need to make some changes to your tiapp.xml
            // SEE: http://docs.appcelerator.com/titanium/latest/#!/guide/Android_Notifications-section-29004809_AndroidNotifications-Usingtheurlproperty
            url: 'app.js',
            flags: Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
        });
        intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);
     
        var pending = Ti.Android.createPendingIntent({
            activity: activity,
            intent: intent,
            type: Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
            flags: Ti.Android.FLAG_ACTIVITY_NO_HISTORY
        });
     
        var notification = Ti.Android.createNotification({
            contentIntent: pending,
            contentTitle: title,
            contentText: body,
            // 'when' will only put the timestamp on the notification and nothing else.
            // Setting it does not show the notification in the future
            when: new Date().getTime(),
            icon: Ti.App.Android.R.drawable.appicon,
            flags: Titanium.Android.ACTION_DEFAULT | Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS
        });

        // Using a different notification count for each notification
        // Using the same number as a previously displayed notification will update it
        Ti.Android.NotificationManager.notify(notificationCount++, notification);

    } else if (IOS) {
        Ti.App.iOS.scheduleLocalNotification({
            alertAction: title,
            alertBody: body,
            date: new Date(new Date().getTime() + 2000) // Needs to be scheduled in the future 
        });

        // Show the number of notifications using the app badge
        Ti.UI.iPhone.appBadge++;
    } else {
        Ti.API.info('Can not show notification on unsupported platform `' + osname + '`');
    }
}


