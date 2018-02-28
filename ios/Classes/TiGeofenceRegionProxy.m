/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013-present by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

#import "TiGeofenceRegionProxy.h"
#import "TiGeofenceModule.h"
#import "TiUtils.h"

@implementation TiGeofenceRegionProxy

- (id)_initWithPageContext:(id<TiEvaluator>)context andRegion:(CLCircularRegion *)region;
{
  if (self = [super _initWithPageContext:context]) {
    _region = region;
  }
  return self;
}

- (void)_initWithProperties:(NSDictionary *)properties
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

  _region = [[CLCircularRegion alloc] initWithCenter:centerCoord radius:radius identifier:identifier];

  [super _initWithProperties:properties];
}

#pragma mark Public APIs

- (NSString *)identifier
{
  return [_region identifier];
}

- (NSDictionary *)center
{
  return @{ @"latitude" : NUMDOUBLE([_region center].latitude),
    @"longitude" : NUMDOUBLE([_region center].longitude) };
}

- (NSNumber *)radius
{
  return NUMDOUBLE([_region radius]);
}

- (void)setNotifyOnEntry:(id)value
{
  [_region setNotifyOnEntry:[TiUtils boolValue:value def:YES]];
}

- (void)setNotifyOnExit:(id)value
{
  [_region setNotifyOnExit:[TiUtils boolValue:value def:YES]];
}

- (NSNumber *)containsCoordinate:(id)args
{
  ENSURE_SINGLE_ARG(args, NSDictionary);
  CLLocationCoordinate2D coord = CLLocationCoordinate2DMake([TiUtils doubleValue:@"latitude" properties:args], [TiUtils doubleValue:@"longitude" properties:args]);
  return NUMBOOL([_region containsCoordinate:coord]);
}

- (CLCircularRegion *)region
{
  return _region;
}

@end
