/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013-present by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

#import "TiModule.h"
#import <CoreLocation/CoreLocation.h>

@interface TiGeofenceModule : TiModule <CLLocationManagerDelegate> {
  @private
  CLLocationManager *_locationManager;
}

- (void)requestStateForRegion:(id)region;

- (NSNumber *)regionMonitoringAvailable:(id)args;

- (void)startMonitoringForRegions:(id)args;

- (void)stopMonitoringForRegions:(id)args;

- (void)stopMonitoringAllRegions:(id)args;

- (NSArray *)monitoredRegions;

@end
