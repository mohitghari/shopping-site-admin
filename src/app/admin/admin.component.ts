import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../firebase-auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AngularFirestore, } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  file: any;
  updatedData;
  products: any[] = [];
  submitted;
  selectedProduct: any;
  myForm: FormGroup;
  error: boolean;
  downloadURL: Observable<any>;
  uploadPercent: Observable<number>;
  constructor(private auth: FirebaseAuthService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.auth.getProducts().subscribe(data => {
      this.products = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      })
    });

    this.myForm = this.fb.group(
      {
        name: ['', Validators.required],
        price: ['', Validators.required],
        //img:['',Validators.]
      }
    );

  }

  updateProduct(product) {
    this.myForm.setValue({
      name: product.name,
      price: product.price
    })
    this.selectedProduct = product;
    console.log(product)
    this.error = false

  }
  saveChanges() {
    if (this.selectedProduct)
     {
      if(!this.file)
      {
        this.updatedData = this.myForm.value
        this.auth.updateProduct(this.file, this.selectedProduct, this.updatedData)
      }  
      else
      {
        let filename = this.file.name.toString();
        if(filename.split(".")[1] == "png" || filename.split(".")[1] == "jpg" || filename.split(".")[1] == "jpeg"){
          this.updatedData = this.myForm.value
          this.auth.updateProduct(this.file, this.selectedProduct, this.updatedData)
        }  
        else{
            alert('File must be image');
        }
      }
    } 
    else 
    {
      this.error = true
    }
  }

  uploadFile(event) {
    this.file = event.target.files[0];
  }

  delProduct(product) {
    this.auth.deleteProduct(product.id)
  }
  _formSubmit() {
    this.submitted = true;
    let productData = this.myForm.value
    if (this.myForm.invalid) {
      return;
    }
    else {
      this.auth.addProductToStorage(this.file, productData);
    }
  }

}
