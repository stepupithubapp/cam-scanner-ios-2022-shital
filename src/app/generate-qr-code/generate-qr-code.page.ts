import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController, Platform } from '@ionic/angular';

import { AdvertisementService } from '../advertisement.service';
import { LocalService } from '../local.service';


@Component({
  selector: 'app-generate-qr-code',
  templateUrl: './generate-qr-code.page.html',
  styleUrls: ['./generate-qr-code.page.scss'],
})
export class GenerateQrCodePage implements OnInit {
  savingLoader: any;
  qrcodeVal: any = "";
  qrcodeType: any = "1";

  qrstring: any = {
    "1": '',
    "2": '',
    "3": {},
    "4": '',
    "5": {}
  };


  constructor(
    public modalController: ModalController,
    public platform: Platform,
    private router: Router,
    public local: LocalService,
    public loadingCtrl: LoadingController,
    private ads: AdvertisementService,
    ) {

  }

  ngOnInit() {
  }

  async saveLoading() {
    this.savingLoader = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Saving...',
      showBackdrop: true,
    });
    await this.savingLoader.present();
  }

  chnageQrcoldetype() {
    this.qrcodeVal = "";

    this.qrstring = {
      "1": '',
      "2": '',
      "3": {},
      "4": '',
      "5": {}
    };
  }


  loadQrCode() {
    if (this.qrcodeType == '1' || this.qrcodeType == '2') {
      this.qrcodeVal = this.qrstring[this.qrcodeType];
    }

    if (this.qrcodeType == '3') {
      if (this.qrstring[this.qrcodeType].name && this.qrstring[this.qrcodeType].org && this.qrstring[this.qrcodeType].phone && this.qrstring[this.qrcodeType].cell && this.qrstring[this.qrcodeType].email) {
        this.qrcodeVal = "BEGIN:VCARD\nVERSION:3.0\nN:"+this.qrstring[this.qrcodeType].name +"\nORG:"+this.qrstring[this.qrcodeType].org+"\nEMAIL;TYPE=INTERNET:"+this.qrstring[this.qrcodeType].email+"\nTEL;TYPE=CELL:"+this.qrstring[this.qrcodeType].cell+"\nTEL:"+this.qrstring[this.qrcodeType].phone+"\nEND:VCARD";
      }
    }

    if (this.qrcodeType == '4') {
      if (this.qrstring[this.qrcodeType]) {
        this.qrcodeVal = 'tel:'+this.qrstring[this.qrcodeType];
      }
    }
    if (this.qrcodeType == '5') {
      if (this.qrstring[this.qrcodeType].phone && this.qrstring[this.qrcodeType].message) {
        this.qrcodeVal = 'SMSTO:'+this.qrstring[this.qrcodeType].phone+':'+this.qrstring[this.qrcodeType].message;
      }
    }

    if (!this.qrcodeVal) {
      this.local.showToastMessage("Please add qrcode text.");
    }
  }

  // Create qr code
  createQr() {
    try {

      let someimage = document.getElementById('qr-img');
      let myimg = someimage.getElementsByTagName('img')[0].src;

      if (!myimg) {
        this.local.showToastMessage("QR code not loaded.");
        return;
      }

      this.saveLoading().then(() => {
        this.local.saveQrCode(myimg, (response)=>{
          this.qrcodeVal = "";
          this.qrcodeType = "1";
          this.local.showToastMessage("Qrcode Save Successfully.");
          this.savingLoader.dismiss();
          this.router.navigate(['/doc']);
        });
      });
    } catch(wee) {
      this.local.showToastMessage("QR code not loaded.");
    }
  }

}
