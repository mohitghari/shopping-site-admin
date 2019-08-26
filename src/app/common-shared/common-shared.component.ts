import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth.service';
import { UserType } from '../util/user-type';
import { format } from 'util';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-common-shared',
  templateUrl: './common-shared.component.html',
  styleUrls: ['./common-shared.component.css']
})
export class CommonSharedComponent implements OnInit {

  submitted;
  myForm: FormGroup;
  error: boolean;
  constructor(private fb: FormBuilder,
    private router: Router,
    private auth: FirebaseAuthService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,

  ) { }

  ngOnInit() {
    this.myForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.email]],
        pwd: ['', [Validators.required, Validators.minLength(6)]],
      }
    );
  }
  _formSubmit() {
    
    this.submitted = true;
    let user = this.myForm.value
    if (this.myForm.invalid) {
      return;
    }else{
        
    this.auth.login(user)
    .subscribe(
      userType => {

        if(userType == UserType.ADMIN){
          this.router.navigate(['/admin'])
        }else if(userType == UserType.CUSTOMER){
          this.router.navigate(['/customer'])
        }else{
          console.error(`Invalid user Type: ${userType}`);
        }
        
      },
      error => console.error('error', error),
      () => console.log('completed')
    );

  }
    /*
    else {
      if (user.username == "admin@admin.com" && user.pwd == "admin123") {
        this.router.navigate(['/admin'])
      }
      else {
        this.auth.login(user).
          then(res => {
            console.log("Login done");
            this.router.navigate(['/customer'])
          }, err => {
            console.log("Login not done");
            this.error = true;
          });
      }
    }
    */
  }


}


