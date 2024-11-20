import { inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { collection, Firestore, getDocs, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {

  private firestore : Firestore = inject(Firestore);
  constructor() { }

  //load Subscribers
  async loadSubscribers(){

      const vas = await getDocs(query(collection(this.firestore, 'subscribers')));
      var data = vas.docs.map((propertie)=>propertie.data());
      console.log("Subscribers  are ",data);
      return data;
      }
}
