import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuhtenticationGuard } from '../auhtentication.guard';
import { AdminAuhtenticationGuard } from '../auhtentication.guard';


const routes: Routes = [
  {
    canActivate: [AdminAuhtenticationGuard],
    path:'admin',
    component:AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
