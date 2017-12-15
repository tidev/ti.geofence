/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013 by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

#import <CoreLocation/CoreLocation.h>
#import "TiProxy.h"

@interface TiGeofenceRegionProxy : TiProxy {
@private
    
}
@property(readonly, nonatomic) CLCircularRegion *region;

-(TiGeofenceRegionProxy *)initWithRegion:(CLCircularRegion *)region pageContext:(id<TiEvaluator>)context;

@end
