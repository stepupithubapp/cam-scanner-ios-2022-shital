import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./documents/documents.module').then( m => m.DocumentsPageModule)
  },
  {
    path: 'tools',
    loadChildren: () => import('./tools/tools.module').then( m => m.ToolsPageModule)
  },
  {
    path: 'scan-identity-card',
    loadChildren: () => import('./scan-identity-card/scan-identity-card.module').then( m => m.ScanIdentityCardPageModule)
  },
  {
    path: 'digital-sign',
    loadChildren: () => import('./digital-sign/digital-sign.module').then( m => m.DigitalSignPageModule)
  },
  {
    path: 'pdf-maker',
    loadChildren: () => import('./pdf-maker/pdf-maker.module').then( m => m.PdfMakerPageModule)
  },
  {
    path: 'manage-scan-document',
    loadChildren: () => import('./manage-scan-document/manage-scan-document.module').then( m => m.ManageScanDocumentPageModule)
  },
  {
    path: 'generate-qr-code',
    loadChildren: () => import('./generate-qr-code/generate-qr-code.module').then( m => m.GenerateQrCodePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
