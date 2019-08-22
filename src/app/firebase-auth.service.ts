import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  cartProducts: any[] = []
  isloggedIn: boolean;
  user;
  userId: string;
  downloadURL: Observable<any>;
  uploadPercent: Observable<number>;
  constructor(private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private afStorage: AngularFireStorage,
  ) {
    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.userId = user.uid;
          console.log('yes')
          this.getdata();
          this.isloggedIn = true;
          this.db.collection(`Users/${user.uid}/products`).snapshotChanges().subscribe(
            data => {
              console.log('data', data);
              this.cartProducts = data.map(e => {
                return {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data()
                };
              })
            }
          );
        }
        else {
          console.log('not log in')
          this.isloggedIn = false;
        }
      }
    )

   
  }

  logOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
  isLoggedIn(): Observable<boolean> {
    return of(this.isloggedIn);
  }

  addTocart(product) {
    let existingProduct = this.cartProducts.find(data => data.id == product.id)
    if (existingProduct) {
      this.db.collection('Users/' + this.userId + '/products').doc(product.id).update({
        quantity: existingProduct.quantity + 1
      })
    }
    else {
      product.quantity = 1;
      this.cartProducts.push(product);
      console.log(this.cartProducts);
      this.db.collection('Users/' + this.userId + '/products').doc(product.id).set(product)
    }
  }
  getCartData(): Observable<any> {

    return this.afAuth.authState
      .pipe(
        flatMap(
          user => {
            return this.db.collection(`Users/${user.uid}/products`).snapshotChanges()
          }
        )
      );
  }

  getdata() {
    this.afAuth.authState.subscribe(
      user => {
        if (user)
          this.user = this.db.collection('Users').doc(user.uid).valueChanges()
        else {
          return null
        }
      }
    )
  }

  updateProduct(file, product, updatedata) {
    console.log(product)
    console.log(product.id)
    console.log(updatedata)
    if (file) {
      const filePath = file.name;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);

      // observe percentage changes
      this.uploadPercent = task.percentageChanges();
      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL()
          this.downloadURL.subscribe(
            data => {
              console.log(data);
              this.db.collection('Product').doc(product.id).update({
                image_url: data,
                name: updatedata.name,
                price: updatedata.price
              })

            }
          )
        })
      )
        .subscribe()

    } else {
      this.db.doc('Product/' + product.id).update({
        name: updatedata.name,
        price: updatedata.price,
      })
    }
  }

  getProducts(): Observable<any> {
    return this.db.collection('Product').snapshotChanges();
  }

  deleteProduct(productId: string) {
    this.db.doc('Product/' + productId).delete();
  }

  addProductToStorage(file, productData) {
    let filename = file.name.toString();
    if (filename.split(".")[1] == "png" || filename.split(".")[1] == "jpg" || filename.split(".")[1] == "jpeg") {
      const filePath = file.name;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, file);

      // observe percentage changes
      this.uploadPercent = task.percentageChanges();
      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL()
          this.downloadURL.subscribe(
            data => {
              console.log(data);
              this.db.collection('Product').add({
                image_url: data,
                name: productData.name,
                price: productData.price
              })

            }
          )
        })
      )
        .subscribe()
    }
    else {
      alert('File must be images')
    }


  }

  login(user) {
    //this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password);
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.username, user.pwd)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }
}
