import { Component, NgZone } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public statusMessage: string;
  public addressKey = "address";
  locationCoords: any;
  timetest: any;
  devices: any[] = [];

  constructor(public bluetoothle: BluetoothLE,
    public platform: Platform,
    private ngZone: NgZone,
    public toastController: ToastController,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private alertController: AlertController) {
    this.platform.ready().then((readySource) => {

      console.log('Platform ready from', readySource);
      this.bluetoothle.enable();
      this.bluetoothle.initialize().subscribe(ble => {
        console.log('ble', ble.status) // logs 'enabled'
        this.setStatus(ble.status);
      });

    });
    this.checkGPSPermission();
  }

  //Check if application having BluetoothLE access permission
  checkBLEPermission() {
    this.bluetoothle.requestPermission().then((res) => {
      console.log(res.requestPermission);
      console.log("res :" + res);
    }, (err) => {
      console.log("err: " + err);
    })
  }

  //Check if application having GPS access permission  
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {

          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {

          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
      },
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

  adapterInfo() {
    this.bluetoothle.getAdapterInfo().then((success) => {
      // console.log("adapterInfo: " + success.name);
      this.setStatus(success.name);
    })
    this.checkBLEPermission();
  }

  startScan() {
    let params = {
      services: [
        "180D",
        "180F"
      ],
    }
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list
    this.bluetoothle.startScan({ services: [] }).subscribe((success) => {
      debugger;
      // console.log("startScan: " + JSON.stringify(success));
      this.setStatus(JSON.stringify(success.status));
      this.ngZone.run(() => {
        this.devices.push(success);
      });
      if (success.status == "scanResult") {
        //Device found
        console.log("scanResult");
      }
      else if (success.status == "scanStarted") {
        //Scan started
        console.log("scanStarted");
      }
    }, (error) => {
      console.log("error: " + JSON.stringify(error));
      this.scanError(JSON.stringify(error));
    })

    setTimeout(() => {
      this.setStatus.bind(this);
    }, 5000, 'Scan complete');
  }

  async connectToDevice(device: any) {
    debugger;
    const alert = await this.alertController.create({
      header: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothle.connect(device.address).subscribe((success) => {
              debugger;
              console.log(success)
              this.setStatus(JSON.stringify(success));
            }, (error) => {
              debugger;
              console.log(error)
              this.scanError(JSON.stringify(error));
            });
          }
        }
      ]
    });
    alert.present();
  }

  stopScan() {
    this.bluetoothle.stopScan().then((resp) => {
      console.log("stopScan: " + resp);
      this.setStatus(resp.status);
    })
  }

  retrieveConnected() {
    let params = {
      "services": [
        "180D",
        "180F"
      ]
    }

    this.bluetoothle.retrieveConnected(params).then((resp) => {
      console.log("retrieveConnected: " + resp);
      this.setStatus("retrieveConnected");
    })
  }

  // If location permission is denied, you'll end up here
  async scanError(error: string) {
    this.setStatus('Error ' + error);
    const toast = await this.toastController.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  setStatus(message: string) {
    // console.log("message: " + message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
}
