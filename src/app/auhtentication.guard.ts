import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators' 

@Injectable({
  providedIn: 'root'
})
export class AuhtenticationGuard implements CanActivate {

  constructor(private auth: FirebaseAuthService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.auth.isLoggedIn().pipe(
      map(e => {
        if (e) {
          return true;
        }
        else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
    
  }
  
}
