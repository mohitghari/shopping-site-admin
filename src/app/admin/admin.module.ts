import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminAuhtenticationGuard } from '../auhtentication.guard';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  providers:[AdminAuhtenticationGuard]
})
export class AdminModule { }
