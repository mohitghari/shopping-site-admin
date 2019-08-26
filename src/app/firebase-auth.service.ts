import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize, flatMap, map } from 'rxjs/operators';
import { UserType } from './util/user-type';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  currentUser;
  cartProducts: any[] = []
  isloggedIn: boolean = true;
  user;
  userId: string;
  downloadURL: Observable<any>;
  uploadPercent: Observable<number>;
  constructor(private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private afStorage: AngularFireStorage,
  ) {


    // this.afAuth.authState.pipe(
    //   flatMap(user => {
    //     if (user) {
    //       this.userId = user.uid
    //       console.log('yes')
    //       this.getdata();
    //       this.isloggedIn = true;
    //       return this.db.collection(`Users/${user.uid}/products`).snapshotChanges()
    //     }
    //     else {
    //       console.log('not log in')
    //       this.isloggedIn = false;
    //     }
    //   }),
    //   map(data => {
    //     console.log(data);
    //     this.cartProducts = data.map(e => {
    //       return {
    //         id: e.payload.doc.id,
    //         ...e.payload.doc.data()
    //       };
    //     })
    //   }

    //   )
    // )

    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.userId = user.uid;
          console.log('yes')
          this.getdata();
          this.isloggedIn = true;
          this.db.collection(`Users/${user.uid}/products`).snapshotChanges().pipe(
            map(data => {
              this.cartProducts = data.map(e => {
                return {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data()
                };
              })
            }
            ));
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
            image_link => {
              console.log(image_link);
              this.db.collection('Product').doc(product.id).update({
                image_url: image_link,
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

  login(user): Observable<UserType> {

    return from(
      this.afAuth.auth.signInWithEmailAndPassword(user.username, user.pwd)
    ).pipe(
      flatMap(user => {
        console.log(user.user)
        const userId = user.user.uid;
        return this.db.collection('AdminUser').doc(userId).get()
      }),
      map(document => {

        // console.log(document.data())
        // console.log('document exists', document.exists);

        if (document.exists === true) {
          this.currentUser = 'admin'
          return UserType.ADMIN
        }
        this.currentUser = 'customer'
        return UserType.CUSTOMER;

      })
    )



    /* return from(
       this.afAuth.auth.signInWithEmailAndPassword(user.username, user.pwd)
     ).pipe(
       flatMap(user => {
         if (user) {
           const userId = user.user.uid;
           return this.db.collection('AdminUser').doc(userId).snapshotChanges()
         }
       }),
       map(doc => {
         console.log(doc.payload.data())
         if (doc.payload.data()) {
           console.log('Admin')
         }
         else {
           console.log('Customer')
         }
       })
     )*/


    // this.afAuth.authState.subscribe(
    //   data=>{
    //     if(data)
    //     {
    //      // console.log(data)
    //       this.db.collection('AdminUser').doc(data.uid).snapshotChanges().subscribe(
    //         data=>{
    //           let d1 = data.payload.data()
    //          // console.log(data.payload.data());
    //           if(d1)
    //           {
    //             console.log('admin')
    //           }
    //           else{
    //             console.log('custmor')
    //           }
    //         }
    //       )                 
    //     }
    //   }
    // )


  }
}
