/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013 by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

package ti.geofence;

import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.KrollProxy;
import org.appcelerator.kroll.annotations.Kroll;

import com.google.android.gms.location.Geofence;


// This proxy can be created by calling Geofence.createExample({message: "hello world"})
@Kroll.proxy(creatableInModule=GeofenceModule.class)
public class RegionProxy extends KrollProxy
{
    // Standard Debugging variables
    private static final String TAG = "RegionProxy";
    
    private String id;
    private double latitude;
    private double longitude;
    private float radius;
    private long expirationDuration;
    private int transitionTypes;

    // Constructor
    public RegionProxy()
    {
        super();
    }

    // Handle creation params
    @Override
    public void handleCreationDict(KrollDict params)
    {
        super.handleCreationDict(params);
        
        if (params.containsKey("identifier")) {
            id = params.getString("identifier");
        } else {
            throw new IllegalArgumentException("`identifier` is required");
        }
        
        // Radius in meters
        if (params.containsKey("radius")) {
            radius = params.getDouble("radius").floatValue();
        } else {
            throw new IllegalArgumentException("`radius` is required");
        }
        
        // ExpirationDuration in milliseconds
        if (params.containsKey("expirationDuration")) {
            expirationDuration = params.getDouble("expirationDuration").longValue();
        } else {
            // Defaults to never like iOS
            expirationDuration = Geofence.NEVER_EXPIRE;
        }
        
        if (params.containsKey("center")) {
            KrollDict center = params.getKrollDict("center");
            latitude = center.getDouble("latitude");
            longitude = center.getDouble("longitude");
        } else {
            throw new IllegalArgumentException("`center` is required");
        }
        
        // Setting transitionTypes of the Geofence using properties for parity with iOS
        // Enter and Exit both default to true
        transitionTypes = 0;
        if (!params.containsKey("notifyOnEntry") || (params.containsKey("notifyOnEntry") && params.getBoolean("notifyOnEntry"))) {
            transitionTypes |= Geofence.GEOFENCE_TRANSITION_ENTER;
        }
        if (!params.containsKey("notifyOnExit") || (params.containsKey("notifyOnExit") && params.getBoolean("notifyOnExit"))) {
            transitionTypes |= Geofence.GEOFENCE_TRANSITION_EXIT;
        }
    }
    
    public Geofence getGeofence()
    {
        return new Geofence.Builder()
            .setRequestId(id)
            .setTransitionTypes(transitionTypes)
            .setCircularRegion(
                    latitude,
                    longitude,
                    radius)
            .setExpirationDuration(expirationDuration)
            .build();
    }
    
    // Methods
    @Kroll.method
    @Kroll.getProperty 
    public String getIdentifier()
    {
        return id;
    }
}