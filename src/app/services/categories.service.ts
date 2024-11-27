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
  saveData(data : any){
    const categoryId = this.generateId();
    setDoc(doc(this.firestore, 'authors', categoryId.toString()),{
      data,
      Id: categoryId
    }).then((docRef)=>{
      console.log("Data saved properly", docRef);
    //  this.toastrservice.success("Data insert successfully");
    }).catch((err)=>{
      console.log(err);
    });
  }

  //load data 
  async loadData(){
    const vas = await getDocs(query(collection(this.firestore, 'authors')));
    var data = vas.docs.map((propertie)=>propertie.data());
    console.log("New value is ",data);
    return data;
  }


  //update data 
  updateData(id: any, editdata: any){
    updateDoc(doc(this.firestore, 'authors', id.toString()), {
      editdata
    }).then((docRef)=>{
      console.log("Data added successfully", docRef);
    }, err=>{
      console.log("Error happened", err);
    });
  }

  //delete data 
  // deleteData(id: any){
  //   return delete(doc(this.firestore, 'users', id.toString()))
  // }

  //load featured
  loadFeatured(){

  }
}
