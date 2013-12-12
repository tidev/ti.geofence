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

#### Example
    Geofence.stopMonitoringForRegions([region, region1]);
    
### void stopMonitoringAllRegions()
Stops monitoring all of the regions that are currently being monitored for the current application.

#### Example
	Geofence.stopMonitoringAllRegions();
    
## Properties

### monitoredRegions [Ti.Geofence.Region]\[] (read-only)
An array of the regions currently being monitored for the current application.

**Note:** iOS only.

#### Example
	var regions = Geofence.monitoredRegions;

## Events

### error
Occurs when there is an error or monitoring failed for a region.

* error[string]: Description of the error
* regions\[[Ti.Geofence.Region]\[]]: The region(s) that monitoring failed for (optional)

### enterregions
Occurs when monitored regions are entered.

* regions\[[Ti.Geofence.Region]\[]]: The region(s) that were entered

### exitregions
Occurs when monitored regions are exited.

* regions\[[Ti.Geofence.Region]\[]]: The region(s) that were exited

### monitorregions
Occurs when regions are added using `stopMonitoringForRegions` and monitoring has successfully started for those regions.

* regions\[[Ti.Geofence.Region]\[]]: The region(s) that monitoring started for

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