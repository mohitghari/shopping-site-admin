import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuhtenticationGuard } from './auhtentication.guard';


const routes: Routes = [
  {
    canActivate:[AuhtenticationGuard],
    path: 'customer',
    loadChildren: () => import('./cutomers/cutomers.module').then(mod => mod.CutomersModule),
    //canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
