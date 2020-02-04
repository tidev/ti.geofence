const Geofence = require('ti.geofence');

const IOS = (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad');

describe('ti.geofence', function () {
	describe('methods', () => {
		describe('#createRegion()', () => {
			it('is a function', () => {
				expect(Geofence.createRegion).toEqual(jasmine.any(Function));
			});
		});

		describe('#startMonitoringForRegions()', () => {
			// eslint-disable-next-line jasmine/no-spec-dupes
			it('is a function', () => {
				expect(Geofence.startMonitoringForRegions).toEqual(jasmine.any(Function));
			});
		});

		describe('#stopMonitoringForRegions()', () => {
			// eslint-disable-next-line jasmine/no-spec-dupes
			it('is a function', () => {
				expect(Geofence.stopMonitoringForRegions).toEqual(jasmine.any(Function));
			});
		});

		describe('#stopMonitoringAllRegions()', () => {
			// eslint-disable-next-line jasmine/no-spec-dupes
			it('is a function', () => {
				expect(Geofence.stopMonitoringAllRegions).toEqual(jasmine.any(Function));
			});
		});

		if (IOS) {
			describe('#regionMonitoringAvailable()', () => {
				// eslint-disable-next-line jasmine/no-spec-dupes
				it('is a function', () => {
					expect(Geofence.regionMonitoringAvailable).toEqual(jasmine.any(Function));
				});
			});

			describe('#requestStateForRegion()', () => {
				// eslint-disable-next-line jasmine/no-spec-dupes
				it('is a function', () => {
					expect(Geofence.requestStateForRegion).toEqual(jasmine.any(Function));
				});
			});
		}
	});
});
