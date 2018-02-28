
//    Platform notes
//    --------------
//    For iOS, add the following permission keys to the <ios> section of the tiapp.xml:
//
//    <key>NSLocationWhenInUseUsageDescription</key>
//		<string>Can we access your location while using the app?</string>
//    <key>NSLocationAlwaysUsageDescription</key>
//		<string>Can we always access your location?</string>
//		<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
//		<string>Can we access your location?</string>
//
//    All three permissions are required for background monitoring, since users of iOS 11
//    and later are able to grant permissions incrementally. 
//    Read more about this in the Ti.Geolocation docs: http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Geolocation.

// --------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------

var osname = Ti.Platform.osname,
    ANDROID = (osname === 'android'),
    IOS = (osname === 'iphone' || osname === 'ipad'),
    defaultFontSize = ANDROID ? '16dp' : 14;

var rows = [
    {
        title: 'createRegion()',
        onClick: function(){
            var region = Geofence.createRegion({
                center: { 
                    latitude:37.389601,
                    longitude:-122.050169
                },
                radius:500,
                identifier:'Appcelerator'
            });
            logInApp('REGION: ' + region + ' with identifier: ' + region.identifier);
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
                radius:500.0, // meters
                identifier:'Test1'
            });
            var region2 = Geofence.createRegion({
                center: { 
                    latitude:37.371173,
                    longitude:-122.142763
                },
                radius:1000, // meters
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
                    latitude:37.38960100,
                    longitude:-122.05016900
                },
                radius:30, // meters
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
                radius:2000,
                identifier:'Test1'
            });
            var region2 = Geofence.createRegion({
                center: { 
                    latitude:37.371173,
                    longitude:-122.142763
                },
                radius:3000,
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
    }
];

// iOS only methods
if (IOS) {
    var iosRows = [
        {
            title: 'regionMonitoringAvailable() (iOS)',
            onClick: function(){
                logInApp('regionMonitoringAvailable: ' + Geofence.regionMonitoringAvailable());
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
                    radius:50,
                    identifier:'Appcelerator'
                });
                // Should be true
                logInApp('containsCoordinate: ' + region.containsCoordinate({
                    latitude:37.389610,
                    longitude:-122.050170
                }));
            }
        },
        {
            title: 'monitoredRegions (iOS)',
            onClick: function(){
                logInApp('monitoredRegions length: ' + Geofence.monitoredRegions.length);
            }
        }
    ];
    rows = rows.concat(iosRows);
}

// Android only methods
if (ANDROID) {
    var Playservices = require('ti.playservices');
    var androidRows = [
        {
            title: 'isGooglePlayServicesAvailable() (Android)',
            onClick: function() {
                logInApp('isGooglePlayServicesAvailable: ' + Playservices.isGooglePlayServicesAvailable());
            }
        },
        {
            title: 'Constants (Android)',
            onClick: function(){
                logInApp('SUCCESS: ' + Geofence.SUCCESS);
                logInApp('SERVICE_MISSING: ' + Geofence.SERVICE_MISSING);
                logInApp('SERVICE_VERSION_UPDATE_REQUIRED: ' + Geofence.SERVICE_VERSION_UPDATE_REQUIRED);
                logInApp('SERVICE_DISABLED: ' + Geofence.SERVICE_DISABLED);
                logInApp('SERVICE_INVALID: ' + Geofence.SERVICE_INVALID);

                logInApp('LOCATION_STATUS_ERROR: ' + Geofence.LOCATION_STATUS_ERROR);
                logInApp('LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE: ' + Geofence.LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE);
                logInApp('LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES: ' + Geofence.LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES);
                logInApp('LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS: ' + Geofence.LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS);
            }
        },
    ];
    rows =  rows.concat(androidRows);
}

// Clear app badge when the app is opened
if (IOS) {
    Ti.UI.iOS.appBadge = 0;
    Ti.App.addEventListener('resume', function() {
        Ti.UI.iOS.appBadge = 0;
    });
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

        // Display local notification
        showNotification({
            title: 'ENTER',
            body: 'enter - ' + e.regions[i].identifier
        });
    }
});

Geofence.addEventListener('exitregions', function(e) {
    logInApp('####### exitregion #######: ' + JSON.stringify(e));
    for (var i = 0, j = e.regions.length; i < j; i++) {
        logInApp('Region id: ' + e.regions[i].identifier);

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
    if (IOS) {
        for (var i = 0, j = e.regions.length; i < j; i++) {
            logInApp('Region id: ' + e.regions[i].identifier);
        }
    }
});

Geofence.addEventListener('removeregions', function(e) {
    // Triggered on Android when regions are removed and are no longer being monitored
    logInApp('####### removeregions #######: ' + JSON.stringify(e));
});

// --------------------------------------------------------------------
// UI
// --------------------------------------------------------------------

var win = Ti.UI.createWindow({
    backgroundColor: 'white'
});

var scrollView =  Ti.UI.createScrollView({
    top: 20,
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
// Utilities
// --------------------------------------------------------------------

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
        Ti.UI.iOS.appBadge++;
    } else {
        Ti.API.info('Can not show notification on unsupported platform `' + osname + '`');
    }
}

if (!Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS)) {
  Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
    if (e.success) {
      alert('Location Permissions ready!');
    } else {
      alert('Error requesting location permissions!');
    }
  });
}
