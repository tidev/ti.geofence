/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013 by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

#import <CoreLocation/CoreLocation.h>
#import "TiModule.h"

@interface TiGeofenceModule : TiModule <CLLocationManagerDelegate>
{
@private
    CLLocationManager *locationManager;
}

@end
