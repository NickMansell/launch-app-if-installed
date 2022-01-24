
Project Plan:

* Create app.*.domain.com cfn script to:
  * point to S3 hosted .well-known/*
  * CloudFront to redirect app.*.domain.com/{PATH} -> *.domain.com/{PATH}

* Set S3 to be all deny except for internal ACL rules
* Add ACL for Cloudfront to access S3 with
* Setup Logging & Monitoring
  * For cloudfront itself
    * what alarms do we need?
  * For function
    * what alarms do we need?
  * Referal URL vs Bounce URL 

  * https://aws.amazon.com/blogs/mt/sending-cloudfront-standard-logs-to-cloudwatch-logs-for-analysis/
* SSL Certificate deploy
* Setup Runbook

done

For handling redirects:
* https://aws.amazon.com/blogs/networking-and-content-delivery/handling-redirectsedge-part2/
* https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-event-structure.html#functions-event-structure-response
* Associate function with default handling on CloudFront
* https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions.html <- 10,000,000 requests per second

* Upload AASA & assetlink files

* External to AWS:
  * DNS for app.*.domain.com -> CloudFront
  * SSL Cert
