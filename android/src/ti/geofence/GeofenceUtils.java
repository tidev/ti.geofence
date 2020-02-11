/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013 by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

package ti.geofence;

/**
 * This class defines constants
 */
public final class GeofenceUtils
{

	// Used to track what type of geofence removal request was made.
	public enum REMOVE_TYPE { INTENT, LIST }

	/*
     * A log tag for the application
     */
	public static final String TAG = "GeofenceModule";

	// Intent actions
	public static final String ACTION_CONNECTION_ERROR = "ti.geofence.ACTION_CONNECTION_ERROR";

	public static final String ACTION_CONNECTION_SUCCESS = "ti.geofence.ACTION_CONNECTION_SUCCESS";

	public static final String ACTION_GEOFENCES_ADDED = "ti.geofence.ACTION_GEOFENCES_ADDED";

	public static final String ACTION_GEOFENCES_REMOVED = "ti.geofence.ACTION_GEOFENCES_DELETED";

	public static final String ACTION_GEOFENCE_ERROR = "ti.geofence.ACTION_GEOFENCES_ERROR";

	public static final String ACTION_GEOFENCE_TRANSITION = "ti.geofence.ACTION_GEOFENCE_TRANSITION";

	public static final String ACTION_GEOFENCE_TRANSITION_ERROR = "ti.geofence.ACTION_GEOFENCE_TRANSITION_ERROR";

	// The Intent category used
	public static final String CATEGORY_LOCATION_SERVICES = "ti.geofence.CATEGORY_LOCATION_SERVICES";

	// Keys for extended data in Intents
	public static final String EXTRA_CONNECTION_CODE = "com.example.android.EXTRA_CONNECTION_CODE";

	public static final String EXTRA_CONNECTION_ERROR_CODE = "ti.geofence.EXTRA_CONNECTION_ERROR_CODE";

	public static final String EXTRA_CONNECTION_ERROR_MESSAGE = "ti.geofence.EXTRA_CONNECTION_ERROR_MESSAGE";

	public static final String EXTRA_GEOFENCE_STATUS = "ti.geofence.EXTRA_GEOFENCE_STATUS";

	public static final String EXTRA_GEOFENCE_STATUS_CODE = "ti.geofence.EXTRA_GEOFENCE_STATUS_CODE";

	public static final String EXTRA_TRANSITION_TYPE = "ti.geofence.EXTRA_TRANSITION_TYPE";

	public static final String EXTRA_GEOFENCE_IDS = "ti.geofence.EXTRA_GEOFENCE_IDS";

	/*
     * Define a request code to send to Google Play services
     * This code is returned in Activity.onActivityResult
     */
	public final static int CONNECTION_FAILURE_RESOLUTION_REQUEST = 9000;

	public static final CharSequence GEOFENCE_ID_DELIMITER = ",";
}
