import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonSharedComponent } from './common-shared.component';


const routes: Routes = [
  {
    path:'login',
    component:CommonSharedComponent
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonSharedRoutingModule { }
