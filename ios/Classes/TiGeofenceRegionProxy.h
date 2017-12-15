/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013-present by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

#import "TiProxy.h"
#import <CoreLocation/CoreLocation.h>

@interface TiGeofenceRegionProxy : TiProxy {
  CLCircularRegion *_region;
}

- (id)_initWithPageContext:(id<TiEvaluator>)context andRegion:(CLCircularRegion *)region;

// The region identifier
- (NSString *)identifier;

// The center coordinates of the region
- (NSDictionary *)center;

// Radius is in meters
- (NSNumber *)radius;

// Defaults to YES if not set
- (void)setNotifyOnEntry:(id)value;

// Defaults to YES if not set
- (void)setNotifyOnExit:(id)value;

// iOS only, no equivalent on Android
- (NSNumber *)containsCoordinate:(id)args;

// The native region instance
- (CLCircularRegion *)region;

@end
