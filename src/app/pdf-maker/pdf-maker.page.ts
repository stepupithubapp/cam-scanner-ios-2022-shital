import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { DocumentScanner, DocumentScannerOptions } from '@awesome-cordova-plugins/document-scanner/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Toast } from '@awesome-cordova-plugins/toast/ngx';

import * as pdfMake from 'pdfmake/build/pdfmake.min.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { ProviderService } from '../provider.service';
import { MobileAdsService } from '../mobile-ads.service';


@Component({
  selector: 'app-pdf-maker',
  templateUrl: './pdf-maker.page.html',
  styleUrls: ['./pdf-maker.page.scss'],
})
export class PdfMakerPage implements OnInit {

  constructor(
    public router: Router,
    public sprovider: ProviderService,
    public imagePicker: ImagePicker,
    public documentScanner: DocumentScanner,
    public file: File,
    public toast: Toast,
    public mariAdsService: MobileAdsService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    ) { }

  ngOnInit() {
    this.sprovider.cropFrom = true;
  }


  // Selct file for create pdf
  selectFile(key) {
    if (key == 1) {
      let opts: DocumentScannerOptions = {
        quality: 2.0,
        returnBase64: true
      };
    
      this.documentScanner.scanDoc(opts)
        .then((res: string) => {
          this.sprovider.scanList.push('data:image/jpeg;base64,' + res);
      }, (err) => {});
    }

    if (key == 2) {
      this.imagePicker.getPictures({
        maximumImagesCount: 50,
        outputType: 1
      }).then((results) => {
        for (let i in results) {
          this.sprovider.scanList.push('data:image/jpeg;base64,' + results[i]);
        }
      }, (err) => { });
    }
  }


  // Save exported files
  saveExportFiles() {
    if (!this.sprovider.scanList.length) {
      return;
    }

    let pdfContent = [];
    
    for (let docRow in this.sprovider.scanList) {
      if (docRow == '0') {
        pdfContent.push({
          image: this.sprovider.scanList[docRow],
          fit: [562, 800],
          alignment: 'center',
        });
      } else {
        pdfContent.push({
          image: this.sprovider.scanList[docRow],
          fit: [562, 800],
          alignment: 'center',
          headlineLevel: 1
        });
      }
    }

    let pdfData = {
      pageSize: 'A4',
      pageMargins: [ 40, 20, 40, 20],
      compress: true,
      content: pdfContent,
      pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
         return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
      },
      styles: {
        story: {
          alignment: 'center',
        }
      }
    };

    let finalDocData = pdfMake.createPdf(pdfData);

    try {
      finalDocData.getBuffer((buffer) => {
        const blob = new Blob([buffer], { type: 'application/pdf' });

        this.file.writeFile(this.file.dataDirectory+'cs-scanner-app', 'My Doc-'+new Date().getTime()+'.pdf', blob, { replace: true }).then(fileEntry => {
          this.toast.show('Save Successfully.', '2000', 'bottom').subscribe(toast => {});
          this.sprovider.scanList = [];
          this.mariAdsService.fullpageadsbatavo();
          this.router.navigate(['/manage-docs'], {replaceUrl: true});
        });
      });
    } catch(err) {}
  }


  // Clear all files from list
  clearAllFiles() {
    if (!this.sprovider.scanList.length) {
      return;
    }
    this.sprovider.scanList = [];
    this.mariAdsService.randomaddbatavo();
  }


  // Swipe
  swipeImagePrev(index) {
    if (index == 0) {
      return;
    }
    const f = this.sprovider.scanList.splice(index, 1)[0];
    this.sprovider.scanList.splice(index-1, 0, f);
  }


  // remove single file
  async removeImage(index) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to remove this image?',
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
            this.sprovider.scanList.splice(index, 1);
          }
        }
      ]
    });

    await alert.present();
  }


  // swipe next
  swipeImageNext(index) {
    if (this.sprovider.scanList.length == (index+1)) {
      return;
    }
    const f = this.sprovider.scanList.splice(index, 1)[0];
    this.sprovider.scanList.splice(index+1, 0, f);
  }


  // replace image file
  async replaceImage(index) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Replace Image',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camera',
        icon: 'camera-outline',
        id: 'camera-button',
        data: {
          type: 'camera'
        },
        handler: () => {
          let opts: DocumentScannerOptions = {
            quality: 2.0,
            returnBase64: true
          };
        
          this.documentScanner.scanDoc(opts)
            .then((res: string) => {
              this.sprovider.scanList[index] = 'data:image/jpeg;base64,' + res;
          }, (err) => {});
        }
      },{
        text: 'Gallery',
        icon: 'image-outline',
        id: 'gallery-button',
        data: {
          type: 'gallery'
        },
        handler: () => {
          this.imagePicker.getPictures({
            maximumImagesCount: 1,
            outputType: 1
          }).then((results) => {
            for (let i in results) {
              this.sprovider.scanList[index] = 'data:image/jpeg;base64,' + results[i];
            }
          }, (err) => { });
            }
      }
      , {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
  }

  cropImage(index) {
    this.sprovider.cropFrom = true;
    this.sprovider.cropIndex = index;
    this.router.navigate(['/crop-file']);
  }
}
