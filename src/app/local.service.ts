import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FileTransfer,
  FileTransferObject,
} from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Market } from '@ionic-native/market/ngx';

import { AdvertisementService } from './advertisement.service';

import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  camScanInfo: any;

  constructor(
    public http: HttpClient,
    public toastService: ToastController,
    public social: SocialSharing,
    public mymoney: AdvertisementService,
    public market: Market,
    public transfer: FileTransfer,
    public file: File,
  ) { }

  // Get app detail
  get_app_detail() {
    return new Promise((resolve, reject) => {
      this.http.post('https://gujaratgauravonlineexam.org/versioncheck/index.php?p=appversion', {
          token: 'cam-scanner-ios-2022-shital',
        })
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  // Show toast message
  async showToastMessage(value) {
    const toast = await this.toastService.create({
      message: value,
      duration: 2000,
    });
    toast.present();
  }

  // rate app
  rateApp() {
    this.market.open('https://apps.apple.com/app/id1606682961');
  }

  // Share app
  shareApp() {
    this.social.share('Cam Scanner', 'Camera Scanner app', '', 'https://apps.apple.com/app/id1606682961').then(() => {
    }).catch(() => {});
  }

  // Sorting
  sortData = (array, key) => {
    return array.sort((a, b) => {
        let x = a[key];
        let y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }





  // -------------------------------------
  // App common functions
  // -------------------------------------

  saveQrCode(data, cb) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const fileURL = this.file.dataDirectory+'/mb-cam-scanner/'+new Date().getTime()+'.png';

      fileTransfer.download(data, fileURL).then((entry) => {
         cb();
      }, (error) => {
    });
  }

  saveDigitalSign(data, filenm, cb) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const fileURL = this.file.dataDirectory+'/mb-cam-scanner/'+filenm;

      fileTransfer.download(data, fileURL).then((entry) => {
         cb();
      }, (error) => {
    });
  }

  saveImageToPdf(data, filenm, cb) {
    let filname = filenm ? filenm : new Date().getTime()+'.pdf';
    const fileTransfer: FileTransferObject = this.transfer.create();
    const fileURL = this.file.dataDirectory+'/mb-cam-scanner/'+filname;

      fileTransfer.download(data, fileURL).then((entry) => {
         cb();
      }, (error) => {
    });
  }

  saveIdcard(data, filenm, cb) {
    let filname = filenm ? filenm : new Date().getTime()+'.jpg';
    const fileTransfer: FileTransferObject = this.transfer.create();
    const fileURL = this.file.dataDirectory+'/mb-cam-scanner/'+filname;

      fileTransfer.download(data, fileURL).then((entry) => {
         cb();
      }, (error) => {
    });
  }
}
