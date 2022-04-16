import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Platform, AlertController, ActionSheetController } from '@ionic/angular';
import { Toast } from '@awesome-cordova-plugins/toast/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Router} from '@angular/router';

import { MobileAdsService } from '../mobile-ads.service';
import { ProviderService } from '../provider.service';

const format = /[`!#$%^&*()+\=\[\]{};':"\\|,<>\/?~]/;


@Component({
  selector: 'app-manage-scan-document',
  templateUrl: './manage-scan-document.page.html',
  styleUrls: ['./manage-scan-document.page.scss'],
})
export class ManageScanDocumentPage implements OnInit {
  isDocumentGetting: boolean = false;
  myDocs: any = [];
  tempDocuments: any = [];
  filterKey: any = 0;
  searchTerm: any = '';


  constructor(
    private file: File,
    private cdr: ChangeDetectorRef,
    public sprovider: ProviderService,
    public actionSheetController: ActionSheetController,
    public toast: Toast,
    public socialSharing: SocialSharing,
    public fileOpener: FileOpener,
    public router: Router,
    private adsNiService: MobileAdsService,
    private alertController: AlertController,
    private fileTransfer: FileTransfer,
  ) { }

  ngOnInit() {
    this.isDocumentGetting = true;
  }
  
  ionViewDidEnter() {
    this.getData();
  }

  getData() {
    try {
      this.isDocumentGetting = true;

      this.file.listDir(this.file.dataDirectory, 'cs-scanner-app')
      .then((entries) => {

        if (entries && entries.length) {
          let count = 0;

          const getFileData = ()=> {
            if (count < entries.length) {
              this.file.resolveLocalFilesystemUrl(entries[count]['nativeURL']).then((fileEntry) => {
                fileEntry.getMetadata(fileObj => {
                  entries[count]['date'] = fileObj['modificationTime'];
                  entries[count]['docName'] = entries[count]['name'].substr(0, entries[count]['name'].lastIndexOf('.'));
                  entries[count]['ext'] = entries[count]['name'].split('.').pop();
                  
                  if (entries[count]['ext'] == 'jpg') {
                    entries[count]['image'] = (window as any).Ionic.WebView.convertFileSrc(entries[count]['nativeURL']);
                  }

                  count += 1;
                  getFileData();
                });
              });

            } else {
              this.myDocs = this.sprovider.sortData(entries, 'date');
              this.tempDocuments = JSON.parse(JSON.stringify(entries));
              this.isDocumentGetting = false;
              this.cdr.detectChanges();
            }
          }

          getFileData();
        } else {
          this.isDocumentGetting = false;
          this.cdr.detectChanges();
        }
      })
      .catch(e => console.log('While reading pdf getting errors' + JSON.stringify(e)));
    } catch(erre) {
      this.myDocs = [];
      this.isDocumentGetting = false;
    }
  }


  // Filter dcument list
  filterDocumentsList(fKey) {
    this.filterKey = fKey;

    if (fKey == 0) {
      this.myDocs = this.tempDocuments;
    }

    if (fKey == 1) {
      this.myDocs = [];
      for (var i in this.tempDocuments) {
        if (this.tempDocuments[i].ext == 'jpg')  {
          this.myDocs.push(this.tempDocuments[i]);
        }
      }
    }

    if (fKey == 2) {
      this.myDocs = [];
      for (var i in this.tempDocuments) {
        if (this.tempDocuments[i].ext == 'pdf')  {
          this.myDocs.push(this.tempDocuments[i]);
        }
      }
    }

    this.cdr.detectChanges();
  }


  // search document from list
  searchFilter(searchTerm) {
    this.myDocs = this.tempDocuments;
    
    this.myDocs = this.myDocs.filter(item => {
      this.cdr.detectChanges();
      return item.docName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
    this.cdr.detectChanges();
  }

  // clear serach text
  onClearSearch() {
    this.myDocs = this.tempDocuments;
    this.cdr.detectChanges();
  }


  async renameFilePopup(doc) {
    const alert = await this.alertController.create({
      cssClass: 'save-as-img-pdf',
      header: 'Document name',
      backdropDismiss: false,
      inputs: [
        {
          name: 'filename',
          type: 'text',
          value: doc.docName,
          placeholder: 'File Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (fnm) => {}
        },
        {
          text: 'Update',
          handler: (fnm) => {
            if (fnm && fnm.filename) {
              if (fnm.filename == doc.docName) {
                return true;
              }

              const fileTransfer: FileTransferObject = this.fileTransfer.create();
              const fileURL = this.file.dataDirectory+'cs-scanner-app/'+fnm.filename+'.'+doc.ext;

              fileTransfer.download(doc.nativeURL, fileURL).then((entry) => {
                this.file.removeFile(this.file.dataDirectory+'cs-scanner-app', doc.name)
                  .then((dres) => {
                    this.getData();
                    this.adsNiService.fullpageadsbatavo();
                  }).catch(err => {
                  });
              }, (error) => {});

              return true;
            } else {
              this.toast.show("Enter file name.", '3000', 'top').subscribe(toast => {});
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }


  async showActionBox(doc) {
    const actionSheet = await this.actionSheetController.create({
      header: doc.name,
      cssClass: 'action-menu',
      buttons: [{
        text: 'View',
        icon: 'eye',
        handler: () => {
          this.viewDocument(doc);
        }
      },{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          for (var k in this.myDocs) {
            if (this.myDocs[k].name == doc.name) {
              this.myDocs.splice(k, 1);
            }
          }

          this.file.removeFile(this.file.dataDirectory+'cs-scanner-app', doc.name)
          .then((dres) => {
            this.toast.show("Document deleted successfully.", '2000', 'center').subscribe(toast => {});
            this.adsNiService.fullpageadsbatavo();
          }).catch(err => {
          });
        }
      }
      , {
        text: 'Rename',
        icon: 'create',
        handler: () => {
          this.renameFilePopup(doc);
        }
      }
      , {
        text: 'Share',
        icon: 'share',
        handler: () => {
          this.socialSharing.share('', 'Documents', this.file.dataDirectory+'cs-scanner-app/'+doc.docName+'.'+doc.ext, '').then(() => {
          }).catch(() => {});
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  viewPdf(file) {
    this.fileOpener.open(file, 'application/pdf')
    .then(() => {})
    .catch(e => console.log('Error opening file', e));
  }

  viewDocument(doc) {
    if (doc.ext == 'pdf' || doc.ext == 'PDF') {
      this.viewPdf(doc.nativeURL);
      return;
    }
    this.sprovider.myImage = doc;
    this.router.navigate(['/imageview']);
  }

}
