# Ti.Geofence.Region

## Description
An object that represents a region to be monitored.

Use the `createRegion` method of [Ti.Geofence] to create a region.

## Methods

### boolean containsCoordinate(args)
Returns true if the coordinates passed to the method represent a point that is within the region.

* args[object]: The argument passed to the method
	* latitude[number]: The latitude of the point to be tested
	* longitude[number]: The longitude of the point to be tested

**Note:** iOS only.

## Properties

### identifier[string]
The unique identifier of the region. 

Required on creation.

### center[object] (creation-only)
An object representing the center coordinate for the region. The object must contain the following properties:

* latitude[number]: Latitude of the center of the region
* longitude[number]: Longitude of the center of the region

Required on creation.

### radius[number] (creation-only)
The radius of the region in meters.

Required on creation.

### notifyOnEntry[boolean] (creation-only)
A boolean controlling whether the region will notify on entry. (default: true)

### notifyOnExit[boolean] (creation-only)
A boolean controlling whether the region will notify on exit. (default: true)


[Ti.Geofence]: index.html