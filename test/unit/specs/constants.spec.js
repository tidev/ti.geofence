let Geofence;

const IOS = (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad');
const ANDROID = (Ti.Platform.osname === 'android');

describe('ti.geofence', () => {
	it('can be required', () => {
		Geofence = require('ti.geofence');

		expect(Geofence).toBeDefined();
	});

	it('.apiName', () => {
		expect(Geofence.apiName).toBe('Ti.Geofence');
	});

	describe('constants', () => {
		if (IOS) {
			describe('REGION_STATE_*', () => {
				it('REGION_STATE_UNKNOWN', () => {
					expect(Map.REGION_STATE_UNKNOWN).toEqual(jasmine.any(Number));
				});

				it('REGION_STATE_INSIDE', () => {
					expect(Map.REGION_STATE_INSIDE).toEqual(jasmine.any(Number));
				});

				it('REGION_STATE_OUTSIDE', () => {
					expect(Map.REGION_STATE_OUTSIDE).toEqual(jasmine.any(Number));
				});
			});
		}

		if (ANDROID) {
			describe('Google Play Services constants', () => {
				it('SUCCESS', () => {
					expect(Map.SUCCESS).toEqual(jasmine.any(Number));
				});

				it('SERVICE_MISSING', () => {
					expect(Map.SERVICE_MISSING).toEqual(jasmine.any(Number));
				});

				it('SERVICE_VERSION_UPDATE_REQUIRED', () => {
					expect(Map.SERVICE_VERSION_UPDATE_REQUIRED).toEqual(jasmine.any(Number));
				});

				it('SERVICE_DISABLED', () => {
					expect(Map.SERVICE_DISABLED).toEqual(jasmine.any(Number));
				});

				it('SERVICE_INVALID', () => {
					expect(Map.SERVICE_INVALID).toEqual(jasmine.any(Number));
				});

				it('LOCATION_STATUS_ERROR', () => {
					expect(Map.LOCATION_STATUS_ERROR).toEqual(jasmine.any(Number));
				});

				it('LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE', () => {
					expect(Map.LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE).toEqual(jasmine.any(Number));
				});

				it('LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES', () => {
					expect(Map.LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES).toEqual(jasmine.any(Number));
				});

				it('LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS', () => {
					expect(Map.LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS).toEqual(jasmine.any(Number));
				});
			});
		}
	});
});
