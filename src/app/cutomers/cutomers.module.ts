import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CutomersComponent } from './cutomers.component';

import { CutomersRoutingModule } from './cutomers-routing.module';


@NgModule({
  declarations: [
    CutomersComponent
  ],
  imports: [
    CommonModule,
    CutomersRoutingModule
  ]
})
export class CutomersModule { }
