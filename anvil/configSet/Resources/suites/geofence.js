/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function () {
	var finish;
	var valueOf;
	var Geofence;

	var IOS = (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad');
	var ANDROID = (Ti.Platform.osname === 'android');

	this.init = function (testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;

		Geofence = require('ti.geofence');
	};

	this.name = 'ti.geofence';

	// Test that module is loaded
	this.testModule = function (testRun) {
		// Verify that the module is defined
		valueOf(testRun, Geofence).shouldBeObject();

		finish(testRun);
	};

	// Test that all of the constants are defined
	this.testConstantsANDROID = function (testRun) {
		// Verify that all of the constants are exposed
		valueOf(testRun, Geofence.SUCCESS).shouldBeNumber();
		valueOf(testRun, Geofence.SERVICE_MISSING).shouldBeNumber();
		valueOf(testRun, Geofence.SERVICE_VERSION_UPDATE_REQUIRED).shouldBeNumber();
		valueOf(testRun, Geofence.SERVICE_DISABLED).shouldBeNumber();
		valueOf(testRun, Geofence.SERVICE_INVALID).shouldBeNumber();
		valueOf(testRun, Geofence.LOCATION_STATUS_ERROR).shouldBeNumber();
		valueOf(testRun, Geofence.LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE).shouldBeNumber();
		valueOf(testRun, Geofence.LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES).shouldBeNumber();
		valueOf(testRun, Geofence.LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS).shouldBeNumber();

		finish(testRun);
	};
	this.testConstantsANDROID.platforms = { android: 1 };

	this.testMethods = function (testRun) {
		// Verify that all of the methods are exposed
		if (IOS) {
			valueOf(testRun, Geofence.regionMonitoringAvailable).shouldBeFunction();
		}

		if (ANDROID) {
			valueOf(testRun, Geofence.isGooglePlayServicesAvailable).shouldBeFunction();
		}

		valueOf(testRun, Geofence.createRegion).shouldBeFunction();
		valueOf(testRun, Geofence.startMonitoringForRegions).shouldBeFunction();
		valueOf(testRun, Geofence.stopMonitoringForRegions).shouldBeFunction();
		valueOf(testRun, Geofence.stopMonitoringAllRegions).shouldBeFunction();

		finish(testRun);
	};

	this.testPropertiesIOS = function (testRun) {
		// Verify that all of the methods are exposed
		valueOf(testRun, Geofence.monitoredRegions).shouldBeArray();

		finish(testRun);
	};
	this.testPropertiesIOS.platforms = { iphone: 1, ipad: 1 };

	this.testRegionMonitoringAvailable = function (testRun) {
		// If this test fails, geofencing will not function on the current test device.
		if (IOS) {
			valueOf(testRun, Geofence.regionMonitoringAvailable()).shouldBeTrue();
		}

		if (ANDROID) {
			valueOf(testRun, Geofence.isGooglePlayServicesAvailable()).shouldBe(Geofence.SUCCESS);
		}

		finish(testRun);
	};

	this.testRegionProxy = function (testRun) {
		var identifier = 'Appcelerator';

		var region = Geofence.createRegion({
			center: {
				latitude: 37.38960100,
				longitude: -122.05016900
			},
			radius: 30,
			identifier: identifier
		});

		valueOf(testRun, region).shouldBeObject();

		// Verify that all of the methods are exposed
		if (IOS) {
			valueOf(testRun, region.containsCoordinate).shouldBeFunction();
		}

		// Verify that all of the methods are exposed
		valueOf(testRun, region.identifier).shouldBeString();
		valueOf(testRun, region.identifier).shouldBe(identifier);

		finish(testRun);
	};

	this.testContainsCoordinateIOS = function (testRun) {
		var region = Geofence.createRegion({
			center: {
				latitude: 37.38960100,
				longitude: -122.05016900
			},
			radius: 500,
			identifier: 'Appcelerator'
		});

		var coordInside = {
			latitude: 37.38960101,
			longitude: -122.05016901
		};
		var coordOutside = {
			latitude: 37.40960101,
			longitude: -122.05016901
		};

		// Verify that containsCoordinate is working
		valueOf(testRun, region.containsCoordinate(coordInside)).shouldBeTrue();
		valueOf(testRun, region.containsCoordinate(coordOutside)).shouldBeFalse();

		finish(testRun);
	};
	this.testContainsCoordinateIOS.platforms = { iphone: 1, ipad: 1 };

	// Populate the array of tests based on the 'hammer' convention
	this.tests = require('hammer').populateTests(this);
}();
