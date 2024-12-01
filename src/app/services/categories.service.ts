import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { collection, deleteDoc, getDocs, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  firestore: Firestore =inject(Firestore);
  constructor() { }


  private generateId(): number {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit ID
    }  
    
    //save data 


  //load data 
  async loadData(){
    const vas = await getDocs(query(collection(this.firestore, 'users')));
    var data = vas.docs.map((propertie)=>propertie.data());
    console.log("New value is ",data);
    return data;
  }



  //delete data 
  // deleteData(id: any){
  //   return delete(doc(this.firestore, 'users', id.toString()))
  // }

  //load featured
  loadFeatured(){

  }
}
