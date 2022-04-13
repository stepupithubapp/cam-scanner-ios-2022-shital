import { Component } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { AlertController, Platform } from '@ionic/angular';

import { AdvertisementService } from './advertisement.service';
import { LocalService } from './local.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  public showNetworkAlert: boolean = false;
  isNetworkPop: any;

  constructor(
    private local: LocalService,
    private file: File,
    public platform: Platform,
    public network: Network,
    private csversion: AppVersion,
    public alertController: AlertController,
    public income: AdvertisementService
  ) {
    this.platform.ready().then(() => {

      // Get app detail (config)
      this.local.get_app_detail().then(
        (result) => {
          this.local.camScanInfo = result['result'];

          this.csversion.getVersionNumber().then(
            (vnumber) => {
              if (this.local.camScanInfo['version'] != vnumber) {
                this.hasNewVerionModal();
              } else {
              }
            },
            (err) => {}
          );
        },
        (error) => {}
      );

      // Create app directory
      try {
        const createAllDir = (dir) => {
          this.file.createDir(this.file.dataDirectory+'/mb-cam-scanner', dir,true).then((result) => {}).catch((err) => {});
        }

        let dirList = ['idcard', 'sign', 'qr-code', 'pdf-maker'];
        this.file.createDir(this.file.dataDirectory,'mb-cam-scanner',true).then((result) => {
          for (let i in dirList) {
            createAllDir(dirList[i]);
          }
        }).catch((err) => {});
      } catch(err){}

      if (this.network.type == 'none') {
        if (this.showNetworkAlert == false) {
          this.isInternet();
        }
      }

      this.getInternetHas();
      this.income.initBanner();
    });
  }

  // Show if app version is new
  async hasNewVerionModal() {
    let alert = await this.alertController.create({
      header: 'Cam Scanner',
      message: "New update available",
      buttons: [
        {
          text: 'Not Now',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Update',
          handler: () => {
            this.local.rateApp();
          },
        },
      ],
    });
    alert.present();
  }


  // Check is internet connection infor
  private getInternetHas(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.showNetworkAlert == false) {
        this.isInternet();
      }
    });

    this.network.onConnect().subscribe(() => {
      if (this.isNetworkPop) {
        this.isNetworkPop.dismiss();
        this.showNetworkAlert = false;
      }
    });
  }

  // Check is internet connection
  async isInternet() {
    this.isNetworkPop = await this.alertController.create({
      header: 'Cam Scanner',
      message: 'No Internet Connection!',
      backdropDismiss: false,
    });

    this.isNetworkPop.present();
    this.showNetworkAlert = true;
  }
}
