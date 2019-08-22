import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
//import { CutomersComponent } from './cutomers/cutomers.component';
import { CommonSharedComponent } from './common-shared/common-shared.component';
import { AdminModule } from './admin/admin.module'
//import { CutomersModule } from './cutomers/cutomers.module'
import { CommonSharedModule } from './common-shared/common-shared.module'
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    //CutomersComponent,
    CommonSharedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    //CutomersModule,
    CommonSharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
