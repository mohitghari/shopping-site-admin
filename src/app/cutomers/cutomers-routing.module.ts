import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CutomersComponent } from './cutomers.component';
import { AuhtenticationGuard } from '../auhtentication.guard';


const routes: Routes = [
  {
    canActivate: [AuhtenticationGuard],
    path:'',
    component:CutomersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CutomersRoutingModule { }
