import { Component, OnInit } from '@angular/core';
import Cropper from 'cropperjs';
import { Router} from '@angular/router';
import { AlertController } from '@ionic/angular';

import { ProviderService } from '../provider.service';
import { MobileAdsService } from '../mobile-ads.service';


@Component({
  selector: 'app-crop-file',
  templateUrl: './crop-file.page.html',
  styleUrls: ['./crop-file.page.scss'],
})
export class CropFilePage implements OnInit {
  cropObj: any;
  cropImg: any;
  cropObject: any;

  constructor(
    public myService: ProviderService,
    public mariAdsService: MobileAdsService,
    public router: Router,
    public alertController: AlertController,
    ) {

    this.cropImg = this.myService.scanList[this.myService.cropIndex];

    setTimeout(()=> {
      this.cropObj = (<any>document).getElementById('crop-image');
      this.cropObject = new Cropper(this.cropObj);
    }, 500);
  }

  ngOnInit() {
  }

  async saveCrop() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to save croped image?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            
          }
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            this.myService.scanList[this.myService.cropIndex] = this.cropObject.getCroppedCanvas().toDataURL();
            this.mariAdsService.randomaddbatavo();

            if (this.myService.cropFrom) {
              this.router.navigate(['/pdf-maker']);
            } else {
              this.router.navigate(['/scan-pdf']);
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
