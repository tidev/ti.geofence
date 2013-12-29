# Ti.Geofence Module

## Description

Allows the battery friendly monitoring of geofences on a device.

## Getting Started

View the [Using Titanium Modules](http://docs.appcelerator.com/titanium/latest/#!/guide/Using_Titanium_Modules) document for instructions on getting
started with using this module in your application.

## Testing

Once you have created some geofence regions that you wish to monitor the next step is testing.
There are several different options when it comes to testing geofences.

**NOTE:** The timing and frequency of location events may vary depending on the environment (device, OS version, etc).

### Drive around with a test device

This is pretty self explanatory.

### Mock locations from the iOS Simulator

Once the application is running in the simulator, select the simulator and go to **Debug**>**Location** and select a location or route that you would like to be sent to the simulator. 

**Note:** At the time of writing, **Freeway Drive** starts at N. DeAnza Blvd and I280 and travels north on I280.

### Mock locations from Xcode

This method will work on both the iOS Simulator and on device.

1. Launch your application once, then go to the build folder of your project and open the Xcode project found in **build/iphone/**. 
2. Run your project using Xcode.
3. Once app is running, Xcode should have a debug area with the debug console at the bottom. At the top of this debug area click on the icon that looks like a small arrow pointing up to the right. 
4. You will see a list of mock locations that can be sent to your running app.
5. Select one of these locations to send it to your app.
6. Alternately click on **Add GPX File to Project...** and select a GPX file with mock locations.
7. There is a GPX provided for you in the **example/MockLocationData/** folder that starts at N. DeAnza Blvd and I280 and travels north on I280.
8. After adding a GPX file, go back and click on the mock locations arrow. The GPX file should now be in the list. Select the mock location to start using it.

**Note:** At the time of writing, this method would not work consistently with Xcode 5 and iOS 7.

### Mock locations from on Android

Add the following to your `tiapp.xml`.

    <uses-permission android:name="android.permission.ACCESS_MOCK_LOCATION" />

Download the "[LocationProvider](http://developer.android.com/shareables/training/LocationProvider.zip)" Android example app and use it to send mock locations to your app.

For more info read [Android's Location testing instructions](http://developer.android.com/training/location/location-testing.html).

## Accessing the Module

Use `require` to access this module from JavaScript:

    var Geofence = require("ti.geofence");

The Geofence variable is a reference to the Module object.

## Methods

### boolean regionMonitoringAvailable()
Returns a boolean value indicating whether region monitoring is supported on the current device.

**Note:** iOS only.

#### Example
    Geofence.regionMonitoringAvailable();    

### number isGooglePlayServicesAvailable()
Returns a number value indicating the availability of Google Play Services which are required to monitor regions.
Possible values include `Ti.Geofence.SUCCESS`, `Ti.Geofence.SERVICE_MISSING`, `Ti.Geofence.SERVICE_VERSION_UPDATE_REQUIRED`, `Ti.Geofence.SERVICE_DISABLED`, and `Ti.Geofence.SERVICE_INVALID`;

**Note:** Android only.

#### Example
    Geofence.isGooglePlayServicesAvailable();   

### [Ti.Geofence.Region] createRegion(params)
Creates a [Ti.Geofence.Region] that can be monitored. Currently all regions are circular.

* params[object]: Object with [Ti.Geofence.Region] properties.
	
#### Example
	var region = Geofence.createRegion({
        center: { 
            latitude:37.389601,
            longitude:-122.050169
        },
        radius:10,
        identifier:'Appcelerator'
    });

### void startMonitoringForRegions(regions)
Starts monitoring the [Ti.Geofence.Region]s passed to the function. Takes either an array of [Ti.Geofence.Region]s or a single [Ti.Geofence.Region] as an argument.

There is a limit to the number of regions that can be monitored at once per application; this limit is enforced by the platform. 

* iOS: 20 Region limit
* Android: 100 Region limit

#### Example
    Geofence.startMonitoringForRegions([region, region1]);
    
### void stopMonitoringForRegions(regions)
Stops monitoring the [Ti.Geofence.Region]s passed to the function. Takes either an array of [Ti.Geofence.Region]s or a single [Ti.Geofence.Region] as an argument.

This method is asynchronous on Android. The `removeregions` event will fire on completion.

#### Example
    Geofence.stopMonitoringForRegions([region, region1]);
    
### void stopMonitoringAllRegions()
Stops monitoring all of the regions that are currently being monitored for the current application.

This method is asynchronous on Android. The `removeregions` event will fire on completion.

#### Example
	Geofence.stopMonitoringAllRegions();
    
## Properties

### monitoredRegions[Ti.Geofence.Region]\[] (read-only)
An array of the regions currently being monitored for the current application.

**Note:** iOS only.

#### Example
	var regions = Geofence.monitoredRegions;

### SUCCESS[number] (read-only)
Possible value returned by `isGooglePlayServicesAvailable`

**Note:** Android only.

### SERVICE_MISSING[number] (read-only)
Possible value returned by `isGooglePlayServicesAvailable`

**Note:** Android only.

### SERVICE_VERSION_UPDATE_REQUIRED[number] (read-only)
Possible value returned by `isGooglePlayServicesAvailable`

**Note:** Android only.

### SERVICE_DISABLED[number] (read-only)
Possible value returned by `isGooglePlayServicesAvailable`

**Note:** Android only.

### SERVICE_INVALID[number] (read-only)
Possible value returned by `isGooglePlayServicesAvailable`

**Note:** Android only.

### LOCATION_STATUS_ERROR[number] (read-only)
Possible value of "errorcode" in the `error` event object

**Note:** Android only.

### LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE[number] (read-only)
Possible value of "errorcode" in the `error` event object

**Note:** Android only.

### LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES[number] (read-only)
Possible value of "errorcode" in the `error` event object

**Note:** Android only.

### LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS[number] (read-only)
Possible value of "errorcode" in the `error` event object

**Note:** Android only.

## Events

### error
Occurs when there is an error or monitoring failed for a region.

* error[string]: Description of the error
* errorcode[number]: An error code for the error. Android only (optional)
* regions (optional)
	* iOS: \[[Ti.Geofence.Region]\[]]: The region(s) that monitoring failed for
	* Android: \[object\[]]: Objects with `identifier` properties representing the region(s) that monitoring failed for

Possible "errorcode" values include `Ti.Geofence.LOCATION_STATUS_ERROR`, `Ti.Geofence.LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE`, `Ti.Geofence.LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES`, `Ti.Geofence.LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS`.

### enterregions
Occurs when monitored regions are entered.

* regions
	* iOS: \[[Ti.Geofence.Region]\[]]: The region(s) that were entered
	* Android: \[object\[]]: Objects with `identifier` properties representing the region(s) that were entered

### exitregions
Occurs when monitored regions are exited.

* regions
	* iOS: \[[Ti.Geofence.Region]\[]]: The region(s) that were exited
	* Android: \[object\[]]: Objects with `identifier` properties representing the region(s) that were exited

### monitorregions
Occurs when regions are added using `startMonitoringForRegions` and monitoring has successfully started for those regions.

* regions
    * iOS: \[[Ti.Geofence.Region]\[]]: The region(s) that monitoring started for
    * Android: \[object\[]]: Objects with `identifier` properties representing the region(s) that monitoring started for

### removeregions
Occurs on Android when regions are remove using `stopMonitoringForRegions` or `stopMonitoringAllRegions` and monitoring has successfully stopped for those regions.

**Note:** Android only.

## Usage
See the example applications in the `example` folder of the module.

## Author

Jon Alter

## Module History

View the [change log](changelog.html) for this module.

## Feedback and Support

Please direct all questions, feedback, and concerns to [info@appcelerator.com](mailto:info@appcelerator.com?subject=Ti.Geofence%20Module).

## License

Copyright(c) 2011-2013 by Appcelerator, Inc. All Rights Reserved. Please see the LICENSE file included in the distribution for further details.

[Ti.Geofence.Region]: region.html