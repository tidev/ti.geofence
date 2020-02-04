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
					expect(Geofence.REGION_STATE_UNKNOWN).toEqual(jasmine.any(Number));
				});

				it('REGION_STATE_INSIDE', () => {
					expect(Geofence.REGION_STATE_INSIDE).toEqual(jasmine.any(Number));
				});

				it('REGION_STATE_OUTSIDE', () => {
					expect(Geofence.REGION_STATE_OUTSIDE).toEqual(jasmine.any(Number));
				});
			});
		}

		if (ANDROID) {
			describe('Google Play Services constants', () => {
				it('SUCCESS', () => {
					expect(Geofence.SUCCESS).toEqual(jasmine.any(Number));
				});

				it('SERVICE_MISSING', () => {
					expect(Geofence.SERVICE_MISSING).toEqual(jasmine.any(Number));
				});

				it('SERVICE_VERSION_UPDATE_REQUIRED', () => {
					expect(Geofence.SERVICE_VERSION_UPDATE_REQUIRED).toEqual(jasmine.any(Number));
				});

				it('SERVICE_DISABLED', () => {
					expect(Geofence.SERVICE_DISABLED).toEqual(jasmine.any(Number));
				});

				it('SERVICE_INVALID', () => {
					expect(Geofence.SERVICE_INVALID).toEqual(jasmine.any(Number));
				});

				it('LOCATION_STATUS_ERROR', () => {
					expect(Geofence.LOCATION_STATUS_ERROR).toEqual(jasmine.any(Number));
				});

				it('LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE', () => {
					expect(Geofence.LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE).toEqual(jasmine.any(Number));
				});

				it('LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES', () => {
					expect(Geofence.LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES).toEqual(jasmine.any(Number));
				});

				it('LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS', () => {
					expect(Geofence.LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS).toEqual(jasmine.any(Number));
				});
			});
		}
	});
});
