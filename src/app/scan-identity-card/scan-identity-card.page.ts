import { Component, OnInit } from '@angular/core';
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { DocumentScanner, DocumentScannerOptions } from '@awesome-cordova-plugins/document-scanner/ngx';
import { Toast } from '@awesome-cordova-plugins/toast/ngx';
import { ProviderService } from '../provider.service';
import { Router} from '@angular/router';
import { Platform, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-scan-identity-card',
  templateUrl: './scan-identity-card.page.html',
  styleUrls: ['./scan-identity-card.page.scss'],
})
export class ScanIdentityCardPage implements OnInit {
  cardScan: any = {};
  loader: any = {};

  constructor(
    public imagePicker: ImagePicker,
    public documentScanner: DocumentScanner,
    public toast: Toast,
    public sprovider: ProviderService,
    public router: Router,
    private loadingController: LoadingController,
    ) { }

  ngOnInit() {
  }


  scanCard(key, index) {
    // From camera
    if (index == 1) {
      let opts: DocumentScannerOptions = {
       quality: 2.0,
       returnBase64: true
      };

      this.documentScanner.scanDoc(opts)
      .then((docRes: string) => {
        this.cardScan[key] = 'data:image/jpeg;base64,' + docRes;
      }).catch((error: any) => {});
    }

    // From gallery
    if (index == 2) {
      const options: ImagePickerOptions = {
        quality: 100,
        outputType: 1,
        maximumImagesCount: 1
      }

      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          this.cardScan[key] = 'data:image/jpeg;base64,' + results[i];
        }
      }, (err) => { });
    }
  }


  async saveThayche() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Saving...',
      showBackdrop: true,
    });
    await this.loader.present();
  }

  // Scan idcard front document
  removeIdDoc(key) {
    this.cardScan[key] = '';
  }

  // Scan idcard front document
  saveCard() {
    if (this.cardScan['front'] && this.cardScan['back']) {
        this.saveThayche().then(() => {

          const content = [{
            image: this.cardScan['front'],
            fit: [220, 220],
            alignment: 'center',
          },{
            image: this.cardScan['back'],
            fit: [220, 220],
            margin: [ 0, 30, 0, 0 ],
            alignment: 'center',
          }];

          this.sprovider.exportDocumentPDF('id-card-'+new Date().getTime(), content, "A4", ()=>{
            this.toast.show("Save Successfully.", '300', 'center').subscribe(toast => {});
            this.cardScan = {};
            this.loader.dismiss();
            this.router.navigate(['/manage-docs'], { replaceUrl: true });
          });
      });
    } else {
      this.toast.show("Please select card from and back.", '300', 'center').subscribe(toast => {});
    }
  }

}
