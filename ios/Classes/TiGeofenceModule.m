/**
 * Appcelerator Titanium Mobile Modules
 * Copyright (c) 2013 by Appcelerator, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */

#import <CoreLocation/CoreLocation.h>
#import "TiGeofenceModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"
#import "TiGeofenceRegionProxy.h"

@implementation TiGeofenceModule

#define ENSURE_ARRAY_OF_TI_REGIONS(arr) \
for (id r in arr) { \
    ENSURE_TYPE(r, TiGeofenceRegionProxy); \
} \

#pragma mark Internal

// this is generated for your module, please do not change it
-(id)moduleGUID
{
    return @"5538c20b-3d6a-4eda-a9f7-0d132275cede";
}

// this is generated for your module, please do not change it
-(NSString*)moduleId
{
    return @"ti.geofence";
}

#pragma mark Lifecycle

-(void)startup
{
    // this method is called when the module is first loaded
    // you *must* call the superclass
    [super startup];
    
    // Need to set the delegate when the module is fired up
    [self locationManager];
    
    NSLog(@"[INFO] %@ loaded",self);
}

#pragma mark Cleanup 

-(void)dealloc
{
    RELEASE_TO_NIL(locationManager);
    // release any resources that have been retained by the module
    [super dealloc];
}

#pragma mark Internal Memory Management

-(void)didReceiveMemoryWarning:(NSNotification*)notification
{
    // optionally release any resources that can be dynamically
    // reloaded once memory is available - such as caches
    [super didReceiveMemoryWarning:notification];
}

#pragma mark Utils

-(CLLocationManager*)locationManager
{
    if (locationManager == nil) {
        if ([CLLocationManager regionMonitoringAvailable]) {
            // CLLocationManager must be initialized on the UI Thread
            TiThreadPerformOnMainThread(^{
                locationManager = [[CLLocationManager alloc] init];
                locationManager.delegate = self;
            }, YES);
        } else {
            NSLog(@"[WARN] Region Monitoring Not Available.");
            return nil;
        }
    }
    return locationManager;
}

#pragma mark CLLocationManagerDelegate

-(void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    if ([self _hasListeners:@"error"])
    {
        NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:
                               [TiGeofenceModule messageFromError:error], @"error",
                               nil];
        [self fireEvent:@"error" withObject:event];
    }
}

-(void)locationManager:(CLLocationManager *)manager monitoringDidFailForRegion:(CLRegion *)region withError:(NSError *)error
{
    if ([self _hasListeners:@"error"])
    {
        // Passing an array of regions for parity with Android
        NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:
                               [TiGeofenceModule messageFromError:error], @"error",
                               [self arrayWithTiRegionsFromRegion:region], @"regions",
                               nil];
        [self fireEvent:@"error" withObject:event];
    }
}

-(void)locationManager:(CLLocationManager *)manager didEnterRegion:(CLRegion *)region
{
    if ([self _hasListeners:@"enterregions"])
    {
        // Passing an array of regions for parity with Android
        NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:
                               [self arrayWithTiRegionsFromRegion:region], @"regions",
                               nil];
        [self fireEvent:@"enterregions" withObject:event];
    }
}

-(void)locationManager:(CLLocationManager *)manager didExitRegion:(CLRegion *)region
{
    if ([self _hasListeners:@"exitregions"])
    {
        // Passing an array of regions for parity with Android
        NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:
                               [self arrayWithTiRegionsFromRegion:region], @"regions",
                               nil];
        [self fireEvent:@"exitregions" withObject:event];
    }
}

-(void)locationManager:(CLLocationManager *)manager didStartMonitoringForRegion:(CLRegion *)region
{
    if ([self _hasListeners:@"monitorregions"])
    {
        // Passing an array of regions for parity with Android
        NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:
                               [self arrayWithTiRegionsFromRegion:region], @"regions",
                               nil];
        [self fireEvent:@"monitorregions" withObject:event];
    }
}

#pragma Public APIs

-(id)regionMonitoringAvailable:(id)args
{
    return NUMBOOL([CLLocationManager regionMonitoringAvailable]);
}

-(void)startMonitoringForRegions:(id)args
{
    // Validation must be done outside of the UI thread or the app will just die without notification
    ENSURE_SINGLE_ARG(args, NSObject);
    if ([args isKindOfClass:[NSArray class]]) {
        ENSURE_ARRAY_OF_TI_REGIONS(args);
        // CLLocationManager methods must be called on the UI thread
        TiThreadPerformOnMainThread(^{
            for (id region in args) {
                [[self locationManager] startMonitoringForRegion:[region region]];
            }
        }, NO);
    } else {
        ENSURE_TYPE(args, TiGeofenceRegionProxy);
        TiThreadPerformOnMainThread(^{
            [[self locationManager] startMonitoringForRegion:[args region]];
        }, NO);
    }
}


-(void)stopMonitoringForRegions:(id)args
{
    // Validation must be done outside of the UI thread or the app will just die without notification
    ENSURE_SINGLE_ARG(args, NSObject);
    if ([args isKindOfClass:[NSArray class]]) {
        ENSURE_ARRAY_OF_TI_REGIONS(args);
        // CLLocationManager methods must be called on the UI thread
        TiThreadPerformOnMainThread(^{
            for (id region in args) {
                [[self locationManager] stopMonitoringForRegion:[region region]];
            }
        }, NO);
    } else {
        ENSURE_TYPE(args, TiGeofenceRegionProxy);
        TiThreadPerformOnMainThread(^{
            [[self locationManager] stopMonitoringForRegion:[args region]];
        }, NO);
    }
}

-(void)stopMonitoringAllRegions:(id)args
{
    ENSURE_UI_THREAD(stopMonitoringAllRegions, args);
    NSArray *regions = [[[self locationManager] monitoredRegions] allObjects];
    for (CLRegion *region in regions) {
        [[self locationManager] stopMonitoringForRegion:region];
    }
}

-(NSArray*)monitoredRegions
{
    NSArray *regions = [[[self locationManager] monitoredRegions] allObjects];
    NSMutableArray *tiRegions = [NSMutableArray arrayWithCapacity:regions.count];
    for (CLRegion *region in regions) {
        TiGeofenceRegionProxy *newRegion = [[TiGeofenceRegionProxy alloc] initWithRegion:region pageContext:[self executionContext]];
        [tiRegions addObject:newRegion];
        [newRegion release];
    }
    return tiRegions;
}

#pragma mark Utils

+(void)logAddedIniOS7Warning:(NSString*)name
{
    NSLog(@"[WARN] `%@` is only supported on iOS 7 and greater.", name);
}

+(NSString*)messageFromError:(NSError *)error
{
    if (error == nil || [error localizedDescription] == nil) {
        return @"Unknown error";
    }
    
    return [error localizedDescription];
}

-(NSArray*)arrayWithTiRegionsFromRegion:(CLRegion *)region
{
    TiGeofenceRegionProxy *tiRegion = [[TiGeofenceRegionProxy alloc] initWithRegion:region pageContext:[self executionContext]];
    NSArray *regions = [NSArray arrayWithObject:tiRegion];
    [tiRegion release];
    return regions;
}

@end
