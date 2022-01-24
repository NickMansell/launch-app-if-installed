
# Background

In order to start merging the App and Web experiences, there has been a request for a feature to launch back to the mobile app if installed through a link on a web page.  

# Research/Options

There are two ways to launch into a mobile app for both iOS and Android:

## Deep Links
 * iOS: Custom Schemes: https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app
 * Android: App Links https://developer.android.com/training/app-links/deep-linking

Deep links rely on a custom scheme to launch a mobile app from another app or website
IE: mobileapp://link/to/feature

### Problems:
* When you navigate to a custom scheme in a web browser, the browser will fail if app not installed.  
* No way to consistently detect if app is installed
* All browsers/OS have slight different tweaks around the above mechanisms

## Universal Links:
* iOS: Universal Links: https://developer.apple.com/ios/universal-links/
* Android: App Links: https://developer.android.com/training/app-links

Domain from which universal link is to be launched declares that is allows iOS and Android apps to intercept certain paths.
Apps declare in their manifest that they can handle links for a given domain.

At the OS level (not browser), before a request is made in the browser, the OS determines if the app should launch instead.  If there's no paired app installed, or customer has opted to not launch the app, the browser will make the request.

NOTE: iOS requires paths to be declared on the host side, Android has this declared in the app itself.

### Problems:
iOS can only launch universal links **_the first time a customer navigates to a given domain/subdomain_**.  This means that if the customer is already on www.mydomain.com, clicking on a link to www.mydomain.com/launch-my-app will not execute for iOS.  Android does allow for this mid-domain intercept.

## Solution
Option 1:
The best way to solve for this is to launch the app intercepts for www.maydomain.com directly, before customer lands on web site experience.  However, not all functionality may be on the app and some functionality that needs to be on web page.

Option 2:
Extra web-only functionality in webview.
Drawback: Maintenance of webview optimized versions of pages can be tricky as you need to extend the testing regime for all web releases to mobile apps too.  Also need to design to not allow users in webview to get to the rest of the web functionality as a whole - you do not want customers browsing the web version of your app in a web-view as this will be confusing.

Option 3:
Create a sub-domain (app.mydomain.com) that can be used to bounce customers off of to "launch-app-if-installed"

Advantages: 
* Allows you to add a "app conversion" intercept if needed.  
* Allows adding "launch-app-if-installed" from anywhere in user's flow


#Project Plan

We opted for option 3 - creating the app.mydomain.com subdomain and bouncing web users off of that.

# Requirements
* Must allow for regular access to */.well-known/* in order to allow for Apple and Android devices to query domain if universal links are allowed.

This means that the traffic requests outside of /.well-known/ are either users who opted not to launch the app or do not have the app currently installed.

* Must redirect requests that come in to app.mydomain.com to mydomain.com, keeping all path, query, cookies and headers in tact.

# Solution

## High level plan:
* Create app.*.domain.com cfn script to:
  * point to S3 hosted .well-known/*
  * CloudFront to redirect app.*.domain.com/{PATH} -> *.domain.com/{PATH}

* Action Items Outside of AWS:
  * domain registration
  * dns entry
  * ssl certs

## Design

### What do we use for http redirects?

Cloudfront + edgefunctions move redirect logic as close to edge as you can go:

For handling redirects:
* https://aws.amazon.com/blogs/networking-and-content-delivery/handling-redirectsedge-part2/
* https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-event-structure.html#functions-event-structure-response
* Associate function with default handling on CloudFront
* https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions.html <- 10,000,000 requests per second

S3 bucket for apple-app-site-association and assetlinks.json hosting

* Set S3 to be all deny except for internal ACL rules
* Add ACL for Cloudfront to access S3 with
* Setup Logging & Monitoring
  * For cloudfront itself
    * what alarms do we need?
  * For function
    * what alarms do we need?
  * Referal URL vs Bounce URL 

  * https://aws.amazon.com/blogs/mt/sending-cloudfront-standard-logs-to-cloudwatch-logs-for-analysis/



* Upload AASA & assetlink files


