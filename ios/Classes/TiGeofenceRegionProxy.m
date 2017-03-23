/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013 by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

#import "TiGeofenceModule.h"
#import "TiGeofenceRegionProxy.h"
#import "TiUtils.h"

@implementation TiGeofenceRegionProxy

@synthesize region = _region;

-(TiGeofenceRegionProxy *)initWithRegion:(CLRegion *)region pageContext:(id<TiEvaluator>)context
{
    if (self = [super _initWithPageContext:context]) {
        _region = [region retain];
    }
    return self;
}

-(id)init
{
    if (self = [super init]) {
        
    }
    return self;
}

-(void)_initWithProperties:(NSDictionary *)properties
{
    // This method is called from _initWithPageContext if arguments have been
    // used to create the proxy. It is called after the initializers have completed
    // and is a good point to process arguments that have been passed to the
    // proxy create method since most of the initialization has been completed
    // at this point.
    
    ENSURE_DICT(properties);
    
    id center = [properties objectForKey:@"center"];
    double radius = [TiUtils doubleValue:@"radius" properties:properties];
    NSString *identifier = [TiUtils stringValue:@"identifier" properties:properties];
    
    // Validation
    ENSURE_TYPE(center, NSDictionary);
    if (radius == 0) {
        [self throwException:[NSString stringWithFormat:@"`radius` is required"] subreason:nil location:CODELOCATION];
    }
    ENSURE_STRING(identifier);
    
    CLLocationCoordinate2D centerCoord;
    centerCoord.latitude = [TiUtils doubleValue:@"latitude" properties:center];
    centerCoord.longitude = [TiUtils doubleValue:@"longitude" properties:center];
    
    // Validation
    if (centerCoord.latitude == 0) {
        [self throwException:[NSString stringWithFormat:@"`center.latitude` is required"] subreason:nil location:CODELOCATION];
    }
    if (centerCoord.longitude == 0) {
        [self throwException:[NSString stringWithFormat:@"`center.longitude` is required"] subreason:nil location:CODELOCATION];
    }
    
    _region = [[CLRegion alloc] initCircularRegionWithCenter:centerCoord radius:radius identifier:identifier];
    
    [super _initWithProperties:properties];
}

-(void)dealloc
{
    RELEASE_TO_NIL(_region);
    [super dealloc];
}

#pragma mark Public APIs

-(id)identifier
{
    return [_region identifier];
}

-(id)center
{
    CLLocationCoordinate2D center = [_region center];
    return [NSDictionary dictionaryWithObjectsAndKeys:
            [NSNumber numberWithDouble:center.latitude], @"latitude",
            [NSNumber numberWithDouble:center.longitude ], @"longitude",
            nil];
}

// Radius is in meters
-(id)radius
{
    return [NSNumber numberWithDouble:[_region radius]];
}

// Defaults to YES if not set
-(void)setNotifyOnEntry:(id)value
{
    if (![TiUtils isIOS7OrGreater]) {
        [TiGeofenceModule logAddedIniOS7Warning:@"notifyOnEntry"];
        return;
    }
    [_region setNotifyOnEntry:[TiUtils boolValue:value def:YES]];
}

// Defaults to YES if not set
-(void)setNotifyOnExit:(id)value
{
    if (![TiUtils isIOS7OrGreater]) {
        [TiGeofenceModule logAddedIniOS7Warning:@"notifyOnExit"];
        return;
    }
    [_region setNotifyOnExit:[TiUtils boolValue:value def:YES]];
}

// iOS only, no equivalent on Android
-(id)containsCoordinate:(id)args
{
    ENSURE_SINGLE_ARG(args, NSDictionary);
    CLLocationCoordinate2D coord;
    coord.latitude = [TiUtils doubleValue:@"latitude" properties:args];
    coord.longitude = [TiUtils doubleValue:@"longitude" properties:args];
    return NUMBOOL([_region containsCoordinate:coord]);
}

@end
