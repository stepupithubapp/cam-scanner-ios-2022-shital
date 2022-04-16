import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { File } from '@awesome-cordova-plugins/file/ngx';

import { LocalService } from '../local.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {
  loadingRecentDoc: boolean = false;
  recentDocs: any = [];

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private local: LocalService,
    private file: File,
    ) { }

  ngOnInit() {
    this.getRecentDocs();
  }

  // Get document list
  getRecentDocs() {
      try {
        this.loadingRecentDoc = true;

        this.file.listDir(this.file.dataDirectory, 'cam-scanner-advance')
        .then((entries) => {
          
          if (entries && entries.length) {
            let count = 0;
            let tmpData = [];

            const getFileInfo = ()=> {
              if (count < entries.length) {
                this.file.resolveLocalFilesystemUrl(entries[count]['nativeURL']).then((fileEntry) => {
                  fileEntry.getMetadata(fileObj => {
                    entries[count]['date'] = fileObj['modificationTime'];
                    entries[count]['docName'] = entries[count]['name'].substr(0, entries[count]['name'].lastIndexOf('.'));
                    entries[count]['ext'] = entries[count]['name'].split('.').pop();
                    entries[count]['isSelect'] = false;
                    
                    if (entries[count]['ext'] == 'jpg' || entries[count]['ext'] == 'png') {
                      entries[count]['image'] = (window as any).Ionic.WebView.convertFileSrc(entries[count]['nativeURL']);
                    }

                    tmpData.push(entries[count]);

                    count += 1;
                    getFileInfo();
                  });
                });
              } else {
                this.recentDocs = this.local.sortData(tmpData, 'date');
                this.loadingRecentDoc = false;
              }
            }

            getFileInfo();
          } else {
            this.loadingRecentDoc = false;
          }
        })
        .catch(e => {
          this.recentDocs = [];
          this.loadingRecentDoc = false;
        });
      } catch(erre) {
        this.recentDocs = [];
        this.loadingRecentDoc = false;
      }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Document',
      buttons: [{
        text: 'View',
        icon: 'eye-outline',
        handler: () => {
          console.log('Delete clicked');
        }
      },{
        text: 'Delete',
        icon: 'trash',
        handler: () => {
          this.deleteDoc();
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Rename',
        icon: 'create-outline',
        handler: () => {
          this.renameDoc();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async renameDoc() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Rename',
      inputs: [
        {
          name: 'doc_name',
          type: 'text',
          placeholder: 'Document Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Save',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteDoc() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

}
