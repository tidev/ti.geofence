/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013 by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

package ti.geofence;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.text.TextUtils;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.LocationStatusCodes;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.kroll.common.Log;
import org.appcelerator.titanium.TiApplication;

@Kroll.module(name = "Geofence", id = "ti.geofence")
public class GeofenceModule extends KrollModule
{
	private static final String TAG = "GeofenceModule";

	// Response from isGooglePlayServicesAvailable()
	@Kroll.constant
	public static final int SUCCESS = 0;
	@Kroll.constant
	public static final int SERVICE_MISSING = 1;
	@Kroll.constant
	public static final int SERVICE_VERSION_UPDATE_REQUIRED = 2;
	@Kroll.constant
	public static final int SERVICE_DISABLED = 3;
	@Kroll.constant
	public static final int SERVICE_INVALID = 9;

	// Error codes sent with the "error" event
	@Kroll.constant
	public static final int LOCATION_STATUS_ERROR = LocationStatusCodes.ERROR;
	@Kroll.constant
	public static final int LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE = LocationStatusCodes.GEOFENCE_NOT_AVAILABLE;
	@Kroll.constant
	public static final int LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES =
		LocationStatusCodes.GEOFENCE_TOO_MANY_GEOFENCES;
	@Kroll.constant
	public static final int LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS =
		LocationStatusCodes.GEOFENCE_TOO_MANY_PENDING_INTENTS;
	@Kroll.constant
	public static final int LOCATION_STATUS_SUCCESS = LocationStatusCodes.SUCCESS;

	// Add geofences handler
	private GeofenceRequester mGeofenceRequester;
	// Remove geofences handler
	private GeofenceRemover mGeofenceRemover;

	/*
     * An instance of an inner class that receives broadcasts from listeners and from the
     * IntentService that receives geofence transition events
     */
	private GeofenceLocalBroadcastReceiver mBroadcastReceiver;

	// An intent filter for the broadcast receiver
	private IntentFilter mIntentFilter;

	public GeofenceModule()
	{
		super();

		// Create a new broadcast receiver to receive updates from the listeners and service
		mBroadcastReceiver = new GeofenceLocalBroadcastReceiver();

		// Create an intent filter for the broadcast receiver
		mIntentFilter = new IntentFilter();

		// Action for broadcast Intents that report successful addition of geofences
		mIntentFilter.addAction(GeofenceUtils.ACTION_GEOFENCES_ADDED);

		// Action for broadcast Intents that report successful removal of geofences
		mIntentFilter.addAction(GeofenceUtils.ACTION_GEOFENCES_REMOVED);

		// Action for broadcast Intents containing various types of geofencing errors
		mIntentFilter.addAction(GeofenceUtils.ACTION_GEOFENCE_ERROR);

		mIntentFilter.addAction(GeofenceUtils.ACTION_GEOFENCE_TRANSITION);

		mIntentFilter.addCategory(GeofenceUtils.CATEGORY_LOCATION_SERVICES);

		// Instantiate a Geofence requester
		mGeofenceRequester = new GeofenceRequester(TiApplication.getAppRootOrCurrentActivity());

		// Instantiate a Geofence remover
		mGeofenceRemover = new GeofenceRemover(TiApplication.getAppRootOrCurrentActivity());

		LocalBroadcastManager.getInstance(TiApplication.getAppRootOrCurrentActivity())
			.registerReceiver(mBroadcastReceiver, mIntentFilter);
	}

	@Override
	public void onDestroy(Activity activity)
	{
		// This method is called when the root context is being destroyed
		LocalBroadcastManager.getInstance(TiApplication.getAppRootOrCurrentActivity())
			.unregisterReceiver(mBroadcastReceiver);
		super.onDestroy(activity);
	}

	// -----------------------------------------
	// Public APIs
	// -----------------------------------------

	@Kroll.method
	public int isGooglePlayServicesAvailable()
	{
		return GooglePlayServicesUtil.isGooglePlayServicesAvailable(TiApplication.getAppRootOrCurrentActivity());
	}

	@Kroll.method
	public void startMonitoringForRegions(Object arg)
	{
		if (!servicesConnected()) {
			return;
		}

		List<Geofence> fences = new ArrayList<Geofence>();
		// Accepting a single region proxy or an array
		if (arg instanceof Object[]) {
			Object[] regions = (Object[]) arg;
			for (int i = 0; i < regions.length; i++) {
				fences.add(((RegionProxy) regions[i]).getGeofence());
			}
		} else if (arg instanceof RegionProxy) {
			RegionProxy region = (RegionProxy) arg;
			fences.add(region.getGeofence());
		} else {
			throw new IllegalArgumentException("Invalid argument type `" + arg.getClass().getName()
											   + "` passed to startMonitoringForRegion()");
		}

		mGeofenceRequester.addGeofences(fences);
	}

	@Kroll.method
	public void stopMonitoringForRegions(Object arg)
	{
		if (!servicesConnected()) {
			return;
		}

		List<String> fenceIds = new ArrayList<String>();
		// Accepting a single region proxy or an array
		if (arg instanceof Object[]) {
			Object[] regions = (Object[]) arg;
			for (int i = 0; i < regions.length; i++) {
				fenceIds.add(((RegionProxy) regions[i]).getGeofence().getRequestId());
			}
		} else if (arg instanceof RegionProxy) {
			RegionProxy region = (RegionProxy) arg;
			fenceIds.add(region.getGeofence().getRequestId());
		} else {
			throw new IllegalArgumentException("Invalid argument type `" + arg.getClass().getName()
											   + "` passed to startMonitoringForRegion()");
		}

		mGeofenceRemover.removeGeofencesById(fenceIds);
	}

	@Kroll.method
	public void stopMonitoringAllRegions()
	{
		mGeofenceRemover.removeGeofencesByIntent(GeofenceModule.getRequestPendingIntent());
	}

	// -----------------------------------------
	// Utils
	// -----------------------------------------

	/**
     * Verify that Google Play services is available before making a request.
     *
     * @return true if Google Play services is available, otherwise false
     */
	private boolean servicesConnected()
	{

		// Check that Google Play services is available
		int resultCode =
			GooglePlayServicesUtil.isGooglePlayServicesAvailable(TiApplication.getAppRootOrCurrentActivity());

		// If Google Play services is available
		if (ConnectionResult.SUCCESS == resultCode) {

			Log.d(TAG, "Play Services is available");

			// Continue
			return true;

			// Google Play services was not available for some reason
		} else {

			Log.e(TAG, "Play Services is NOT available");
			return false;
		}
	}

	private HashMap<String, Object>[] regionDictsFromIdArray(String[] geofenceIds)
	{
		HashMap<String, Object>[] regions = new HashMap[geofenceIds.length];
		for (int i = 0; i < geofenceIds.length; i++) {
			HashMap<String, Object> region = new HashMap<String, Object>();
			region.put("identifier", geofenceIds[i]);
			regions[i] = region;
		}

		return regions;
	}

	public static PendingIntent getRequestPendingIntent()
	{
		// Create an Intent pointing to the IntentService
		Intent intent = new Intent(TiApplication.getAppRootOrCurrentActivity(), ReceiveTransitionsIntentService.class);
		/*
         * Return a PendingIntent to start the IntentService.
         * Always create a PendingIntent sent to Location Services
         * with FLAG_UPDATE_CURRENT, so that sending the PendingIntent
         * again updates the original. Otherwise, Location Services
         * can't match the PendingIntent to requests made with it.
         */

		// MOD-1639: Creating a new PendingIntent each time it is needed.
		// Keeping the PendingIntent in a variable was causing problems.
		return PendingIntent.getService(TiApplication.getAppRootOrCurrentActivity(), 0, intent,
										PendingIntent.FLAG_UPDATE_CURRENT);
	}

	/**
     * Define a Broadcast receiver that receives updates from connection listeners and
     * the geofence transition service.
     */
	public class GeofenceLocalBroadcastReceiver extends BroadcastReceiver
	{
		/*
         * Define the required method for broadcast receivers
         * This method is invoked when a broadcast Intent triggers the receiver
         */
		@Override
		public void onReceive(Context context, Intent intent)
		{

			// Check the action code and determine what to do
			String action = intent.getAction();

			// Intent contains information about errors in adding geofences
			if (TextUtils.equals(action, GeofenceUtils.ACTION_GEOFENCE_ERROR)) {
				Log.d(TAG, "GeofenceLocalBroadcastReceiver ACTION_GEOFENCE_ERROR");
				handleGeofenceError(context, intent);

				// Intent contains information about successful addition of geofences
			} else if (TextUtils.equals(action, GeofenceUtils.ACTION_GEOFENCES_ADDED)) {
				Log.d(TAG, "GeofenceLocalBroadcastReceiver ACTION_GEOFENCES_ADDED");
				handleGeofenceStatus(context, intent);

				// Intent contains information about successful removal of geofences
			} else if (TextUtils.equals(action, GeofenceUtils.ACTION_GEOFENCES_REMOVED)) {
				Log.d(TAG, "GeofenceLocalBroadcastReceiver ACTION_GEOFENCES_REMOVED");
				// There is no equivalent on iOS. On Android remove is async.
				handleGeofenceStatus(context, intent);

				// Intent contains information about a geofence transition
			} else if (TextUtils.equals(action, GeofenceUtils.ACTION_GEOFENCE_TRANSITION)) {
				Log.d(TAG, "GeofenceLocalBroadcastReceiver ACTION_GEOFENCE_TRANSITION");
				handleGeofenceTransition(context, intent);

				// The Intent contained an invalid action
			} else {
				Log.d(TAG, "GeofenceLocalBroadcastReceiver recived an unsupported action: " + action);
			}
		}

		// -----------------------------------------
		// Events
		// -----------------------------------------

		private void handleGeofenceStatus(Context context, Intent intent)
		{
			if (hasListeners("monitorregions") || hasListeners("removeregions")) {
				String[] geofenceIds = intent.getStringArrayExtra(GeofenceUtils.EXTRA_GEOFENCE_IDS);

				HashMap<String, Object> event = new HashMap<String, Object>();
				if (geofenceIds != null) {
					event.put("regions", regionDictsFromIdArray(geofenceIds));
				}

				String action = intent.getAction();
				if (TextUtils.equals(action, GeofenceUtils.ACTION_GEOFENCES_ADDED)) {
					fireEvent("monitorregions", event);
				} else if (TextUtils.equals(action, GeofenceUtils.ACTION_GEOFENCES_REMOVED)) {
					fireEvent("removeregions", event);
				} else {
					Log.d(TAG, "Unsupported action received: " + action);
				}
			}
		}

		private void handleGeofenceTransition(Context context, Intent intent)
		{
			if (hasListeners("enterregions") || hasListeners("exitregions")) {
				int transitionType = intent.getIntExtra(GeofenceUtils.EXTRA_TRANSITION_TYPE, -1);
				String[] geofenceIds = intent.getStringArrayExtra(GeofenceUtils.EXTRA_GEOFENCE_IDS);

				HashMap<String, Object> event = new HashMap<String, Object>();
				if (geofenceIds != null) {
					event.put("regions", regionDictsFromIdArray(geofenceIds));
				}

				if (transitionType == Geofence.GEOFENCE_TRANSITION_ENTER) {
					fireEvent("enterregions", event);
				} else if (transitionType == Geofence.GEOFENCE_TRANSITION_EXIT) {
					fireEvent("exitregions", event);
				} else {
					Log.d(TAG, "Unsupported transition type received: " + transitionType);
				}
			}
		}

		/**
         * Report addition or removal errors, fire an event here.
         *
         * @param intent A broadcast Intent sent by ReceiveTransitionsIntentService
         */
		private void handleGeofenceError(Context context, Intent intent)
		{
			String msg = intent.getStringExtra(GeofenceUtils.EXTRA_GEOFENCE_STATUS);
			Log.e(TAG, msg);

			if (hasListeners("error")) {
				String[] geofenceIds = intent.getStringArrayExtra(GeofenceUtils.EXTRA_GEOFENCE_IDS);

				HashMap<String, Object> event = new HashMap<String, Object>();
				event.put("error", msg);
				if (geofenceIds != null) {
					// Add regions array to event object
					event.put("regions", regionDictsFromIdArray(geofenceIds));
				}
				int errorCode = intent.getIntExtra(GeofenceUtils.EXTRA_GEOFENCE_STATUS_CODE, -1);
				if (errorCode != -1) {
					event.put("errorcode", errorCode);
				}
				fireEvent("error", event);
			}
		}
	}

	@Override
	public String getApiName()
	{
		return "Ti.Geofence";
	}
}
