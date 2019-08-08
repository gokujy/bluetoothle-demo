# Prerequisities

* [Node.js](http://nodejs.org/) - install node 10.15.3 - see the installation instructions on the site      
NOTE: It is recommended to install and use nvm (see https://github.com/creationix/nvm) and install node 10.15.3 by issuing `nvm install v10.15.3`
* Switch to node 10.15.3 by issuing nvm use 10.15.3 (you may want to make this default node version)
* [Ionic CLI](http://ionicframework.com/docs/cli/install.html) - install ionic cli version 4.11.0 by issuing commands `npm install -g ionic@4.11.0`   
* [Cordova](https://cordova.apache.org/) - install cordova cli version 8.1.2 by issuing command `npm install -g cordova@8.1.2`   
* If you plan to build and/or publish the application to Google Play Market and Apple Store please:
    + for Android please:
        * create Google Developer account   
        * install the [required software](https://cordova.apache.org/docs/en/latest/guide/platforms/android/#installing-the-requirements)
    + for iOS please:
        * Install ios-sim to deploy iOS applications.`npm install -g ios-sim` (may require sudo)
        * Install ios-deploy to deploy iOS applications to devices.  `npm install -g ios-deploy` (may require sudo)
        * install [XCode](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/#xcode)
        * enroll into [Apple Development Program](https://developer.apple.com/programs/)   
        * Please note that starting iOS 10, nearly all APIs that require requesting authorization and other APIs, such as opening the camera or photo gallery, require a new key value pair to describe their usage in the project Info.plist

# Instructions

## Initial setup
1. clone the source code repository
2. change to project repository directory (the directory where you cloned the repo)   
3. Execute the command `npm install`   
4. Execute the command `ionic cordova prepare`   
7. Run Ionic:  
   - `ionic serve` to build and run in the browser     
   - `ionic cordova run android` to build and run on an Android device   
   - `ionic cordova prepare ios` to build and then start the appropriate XCode workspace and build/run on an iOS device   

# Creating/publishing release build   
## For Android

To create release build please:  
1. go to project repository directory (<Git>\src)  
2. pull the latest changes from the repository   
3. make sure that the configuration params are correct - see **Configuration** section above    
4. change build number in version param in **config.xml**      
5. change `ionic_source_map_type` from `#inline-source-map` to be `source-map` in package.json

```
#!javascript

  "config": {
    "ionic_bundler": "webpack",
    "ionic_source_map_type": "source-map"
  }

```
      
6. change `ionic_generate_source_map' to false, in package.json

```
#!javascript

  "config": {
    "ionic_generate_source_map": false,
  }

```

Note that this is required not to include source maps into the PROD release.   
7. issue the command `ionic cordova build android --release --prod`  
This will create the required APK for all platforms  
8. change to **<Git>\src\platforms\android\app\build\outputs\apk\release** directory where signed and zip aligned release build APK files will be created   
9. publish the release build in Google Play Store  


## For iOS   
**Note:** some steps are optional if have been executed when preparing Android build

To create release build please:  
1. go to project repository directory (<Git>\src)  
2. pull the latest changes from the repository   
3. make sure that the configuration params are correct - see **Configuration** section above   
4. change build number in version param in **config.xml**    
5. change `ionic_source_map_type` from `#inline-source-map` to be `source-map` in package.json

```
#!javascript

  "config": {
    "ionic_bundler": "webpack",
    "ionic_source_map_type": "source-map"
  }

```
      
6. change `ionic_generate_source_map' to false, in package.json

```
#!javascript

  "config": {
    "ionic_generate_source_map": false,
  }

```

Note that this is required not to include source maps into the PROD release.   
7. issue `ionic cordova prepare ios --release --prod` command   
8. change to **<Git>\src\platforms\ios** directory   
9. open XCode project by clicking ZoroMobileApp.xcworkspace file   
Note: for more details about using XCode to build/publish see [Open the project within XCode](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/#open-a-project-within-xcode)   
10. make sure that the build number is correct    
11. build and publish the release build in Apple Store  
Note: for more details see https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/UploadingYourApptoiTunesConnect/UploadingYourApptoiTunesConnect.html#//apple_ref/doc/uid/TP40012582-CH36-SW2 and http://tutorials.pluralsight.com/front-end-javascript/ionic-framework-a-definitive-10-000-word-guide   


# How To
## Enable apk file sign and zipalign automatically
1. Create signing key by issuing the below command
`keytool -genkey -v -keystore zoro.mobile.keystore -alias zoro.mobile -keyalg RSA -keysize 2048 -validity 10000`
and provide the password zoro903 when prompted 
2. Add build.json file into the root directory of the project with the content below
```
#!javascript

{
  "android": {
    "debug": {
      "keystore": "zoro.mobile.keystore",
      "storePassword": "zoro903",
      "alias": "zoro.mobile",
      "password": "zoro903",
      "keystoreType": ""
    },
    "release": {
      "keystore": "zoro.mobile.keystore",
      "storePassword": "zoro903",
      "alias": "zoro.mobile",
      "password": "zoro903",
      "keystoreType": ""
    }
  }
}
```
Now, when you issue `ionic cordova build --release android` or `ionic cordova build android` the apk created will be automatically signed and zipaligned

## Managing Plugins
### Refresh all platforms and plugins
To reset platforms and plugins (like we just checked out the repository) please:   
* issue  ```rm -rf platforms plugins```   
* issue  ```ionic cordova prepare```  (not working and ask to add platforms manually; needs to research) 

### Refresh single plugin 
* issue  ```ionic cordova plugin rm [<plugin>]```   
* revert all local changes ```git checkout .```   
* issue ```ionic cordova plugin add [<plugin>]```   

### Add new plugin
* issue ```ionic cordova plugin add [<plugin>]@[<exact plugin version>] [options] --save --save-exact```

### Permanently remove plugin
* issue ```ionic cordova plugin rm [<plugin>] --save```

For more details about platforms and plugin management please see https://cordova.apache.org/docs/en/latest/platform_plugin_versioning_ref/

