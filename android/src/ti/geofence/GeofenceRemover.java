/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013 by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

package ti.geofence;

import java.util.List;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender.SendIntentException;
import android.os.Bundle;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.common.api.GoogleApiClient.ConnectionCallbacks;
import com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener;
import com.google.android.gms.location.LocationServices;

/**
 * Class for connecting to Location Services and removing geofences.
 * <p>
 * <b>
 * Note: Clients must ensure that Google Play services is available before removing geofences.
 * </b> Use GooglePlayServicesUtil.isGooglePlayServicesAvailable() to check.
 * <p>
 * To use a GeofenceRemover, instantiate it, then call either RemoveGeofencesById() or
 * RemoveGeofencesByIntent(). Everything else is done automatically.
 *
 */
public class GeofenceRemover implements
							ConnectionCallbacks,
							OnConnectionFailedListener,
							ResultCallback<Status> {

    private static final String TAG = "GeofenceRemover";
    
    // Storage for a reference to the calling client
    private final Activity mActivity;

    // Stores the current list of geofences
    private List<String> mCurrentGeofenceIds;

    // Stores the current instantiation of the location client
    protected GoogleApiClient mGoogleApiClient;

    // The PendingIntent sent in removeGeofencesByIntent
    private PendingIntent mCurrentIntent;

    /*
     *  Record the type of removal. This allows continueRemoveGeofences to call the appropriate
     *  removal request method.
     */
    private GeofenceUtils.REMOVE_TYPE mRequestType;

    /*
     * Flag that indicates whether an add or remove request is underway. Check this
     * flag before attempting to start a new request.
     */
    private boolean mInProgress;

    /**
     * Construct a GeofenceRemover for the current Context
     *
     * @param context A valid Context
     */
    public GeofenceRemover(Activity activityContext) {
        // Save the context
        mActivity = activityContext;

        // Initialize the globals to null
        mCurrentGeofenceIds = null;
        mGoogleApiClient = null;
        mInProgress = false;
    }

    /**
     * Set the "in progress" flag from a caller. This allows callers to re-set a
     * request that failed but was later fixed.
     *
     * @param flag Turn the in progress flag on or off.
     */
    public void setInProgressFlag(boolean flag) {
        // Set the "In Progress" flag.
        mInProgress = flag;
    }

    /**
     * Get the current in progress status.
     *
     * @return The current value of the in progress flag.
     */
    public boolean getInProgressFlag() {
        return mInProgress;
    }

    /**
     * Remove the geofences in a list of geofence IDs. To remove all current geofences associated
     * with a request, you can also call removeGeofencesByIntent.
     * <p>
     * <b>Note: The List must contain at least one ID, otherwise an Exception is thrown</b>
     *
     * @param geofenceIds A List of geofence IDs
     */
    public void removeGeofencesById(List<String> geofenceIds) throws
        IllegalArgumentException, UnsupportedOperationException {
        // If the List is empty or null, throw an error immediately
        if ((null == geofenceIds) || (geofenceIds.size() == 0)) {
            throw new IllegalArgumentException();

        // Set the request type, store the List, and request a location client connection.
        } else {

            // If a removal request is not already in progress, continue
            if (!mInProgress) {
                mRequestType = GeofenceUtils.REMOVE_TYPE.LIST;
                mCurrentGeofenceIds = geofenceIds;
                requestConnection();

            // If a removal request is in progress, throw an exception
            } else {
                throw new UnsupportedOperationException();
            }
        }
    }

    /**
     * Remove the geofences associated with a PendIntent. The PendingIntent is the one used
     * in the request to add the geofences; all geofences in that request are removed. To remove
     * a subset of those geofences, call removeGeofencesById().
     *
     * @param requestIntent The PendingIntent used to request the geofences
     */
    public void removeGeofencesByIntent(PendingIntent requestIntent) {

        // If a removal request is not in progress, continue
        if (!mInProgress) {
            // Set the request type, store the List, and request a location client connection.
            mRequestType = GeofenceUtils.REMOVE_TYPE.INTENT;
            mCurrentIntent = requestIntent;
            requestConnection();

        // If a removal request is in progress, throw an exception
        } else {

            throw new UnsupportedOperationException();
        }
    }

    /**
     * Once the connection is available, send a request to remove the Geofences. The method
     * signature used depends on which type of remove request was originally received.
     */
    private void continueRemoveGeofences() throws SecurityException {
        switch (mRequestType) {

            // If removeGeofencesByIntent was called
            case INTENT :
                try {
                    // Remove geofences.
                    LocationServices.GeofencingApi.removeGeofences(
                            mGoogleApiClient,
                            // This is the same pending intent that was used in addGeofences().
                            GeofenceModule.getRequestPendingIntent()
                    ).setResultCallback(this); // Result processed in onResult().
                } catch (SecurityException securityException) {
                    // Catch exception generated if the app does not use ACCESS_FINE_LOCATION permission.
                	requestDisconnection();
                	throw securityException;
                }
                break;

            // If removeGeofencesById was called
            case LIST :
            	try {
                    // Remove geofences.
                    LocationServices.GeofencingApi.removeGeofences(
                            mGoogleApiClient,
                            // Removes geofences by their request IDs.
                            mCurrentGeofenceIds
                    ).setResultCallback(this); // Result processed in onResult().
                } catch (SecurityException securityException) {
                    // Catch exception generated if the app does not use ACCESS_FINE_LOCATION permission.
                	requestDisconnection();
                	throw securityException;
                }
                break;
        }
        

    }

    /**
     * Request a connection to Location Services. This call returns immediately,
     * but the request is not complete until onConnected() or onConnectionFailure() is called.
     */
    private void requestConnection() {
    	getGoogleApiClient().connect();
    }

    /**
     * Builds a GoogleApiClient. Uses the {@code #addApi} method to request the LocationServices API.
     */
    protected synchronized void buildGoogleApiClient() {
    	if (mGoogleApiClient == null) {
    		mGoogleApiClient = new GoogleApiClient.Builder(mActivity, this, this)
            .addConnectionCallbacks(this)
            .addOnConnectionFailedListener(this)
            .addApi(LocationServices.API)
            .build();
        }
    }
    
    private GoogleApiClient getGoogleApiClient(){
    	if(mGoogleApiClient == null) {
    		buildGoogleApiClient();
    	}
    	return mGoogleApiClient;
    }
    

	@Override
	public void onResult(Status status) {

        // Create a broadcast Intent that notifies other components of success or failure
        Intent broadcastIntent = new Intent();
        String msg;
        
        // If removing the geofences was successful
        if (status.isSuccess()) {

            msg = "Remove GeoFence intent SUCCESS";
            // Create a message containing all the geofence IDs removed.
            //msg = "Remove GeoFences SUCCESS ids:" + Arrays.toString(geofenceRequestIds); 
            Log.d(TAG, msg);
            
            // Set the action and add the result message
            broadcastIntent.setAction(GeofenceUtils.ACTION_GEOFENCES_REMOVED);
            broadcastIntent.putExtra(GeofenceUtils.EXTRA_GEOFENCE_STATUS,
                    msg);

        // If removing the geocodes failed
        } else {
            msg = "Remove GeoFence intent FAILED";
            //msg = "Remove GeoFences FAILED ids:" + Arrays.toString(geofenceRequestIds); 
            // Always log the error
            Log.e(TAG,msg);

            // Set the action and add the result message
            broadcastIntent.setAction(GeofenceUtils.ACTION_GEOFENCE_ERROR)
                            .putExtra(GeofenceUtils.EXTRA_GEOFENCE_STATUS, msg)
                            //.putExtra(GeofenceUtils.EXTRA_GEOFENCE_IDS, geofenceRequestIds)
                            .putExtra(GeofenceUtils.EXTRA_GEOFENCE_STATUS_CODE, status.getStatusCode());
            
        }

        // Broadcast the Intent to all components in this app
        LocalBroadcastManager.getInstance(mActivity).sendBroadcast(broadcastIntent);

        // Disconnect the location client
        requestDisconnection();
		
	}

    /**
     * Get a location client and disconnect from Location Services
     */
    private void requestDisconnection() {

        // A request is no longer in progress
        mInProgress = false;

        getGoogleApiClient().disconnect();
        /*
         * If the request was done by PendingIntent, cancel the Intent. This prevents problems if
         * the client gets disconnected before the disconnection request finishes; the location
         * updates will still be cancelled.
         */
        if (mRequestType == GeofenceUtils.REMOVE_TYPE.INTENT) {
            mCurrentIntent.cancel();
        }

    }

    /*
     * Called by Location Services once the location client is connected.
     *
     * Continue by removing the requested geofences.
     */
    @Override
    public void onConnected(Bundle arg0) {
        // If debugging, log the connection
        Log.d(TAG, "CONNECTED to Location Services");

        // Continue the request to remove the geofences
        continueRemoveGeofences();
    }

    /*
     * Implementation of OnConnectionFailedListener.onConnectionFailed
     * If a connection or disconnection request fails, report the error
     * connectionResult is passed in from Location Services
     */
    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

        // A request is no longer in progress
        mInProgress = false;

        /*
         * Google Play services can resolve some errors it detects.
         * If the error has a resolution, try sending an Intent to
         * start a Google Play services activity that can resolve
         * error.
         */
        if (connectionResult.hasResolution()) {

            try {
                // Start an Activity that tries to resolve the error
                connectionResult.startResolutionForResult((Activity) mActivity,
                    GeofenceUtils.CONNECTION_FAILURE_RESOLUTION_REQUEST);

            /*
             * Thrown if Google Play services canceled the original
             * PendingIntent
             */
            } catch (SendIntentException e) {
                // Log the error
                e.printStackTrace();
            }

        /*
         * If no resolution is available, put the error code in
         * an error Intent and broadcast it back to the main Activity.
         * The Activity then displays an error dialog.
         * is out of date.
         */
        } else {

            Intent errorBroadcastIntent = new Intent(GeofenceUtils.ACTION_CONNECTION_ERROR);
            errorBroadcastIntent.addCategory(GeofenceUtils.CATEGORY_LOCATION_SERVICES)
                                .putExtra(GeofenceUtils.EXTRA_CONNECTION_ERROR_CODE,
                                        connectionResult.getErrorCode());
            LocalBroadcastManager.getInstance(mActivity).sendBroadcast(errorBroadcastIntent);
        }
    }

	@Override
	public void onConnectionSuspended(int arg0) {
		// The connection to Google Play services was lost for some reason. 
        Log.d(TAG, "Connection suspended");
        
        // onConnected() will be called again automatically when the service reconnects
		
	}
    
    
}
