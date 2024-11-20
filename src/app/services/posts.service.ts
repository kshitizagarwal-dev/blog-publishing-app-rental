import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteField, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private firestore : Firestore = inject(Firestore);
  constructor() { }

  private generateId(): number {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit ID
    }  

    //save post Data 
    savePost(data : any){
      const postId = this.generateId();
      setDoc(doc(this.firestore, 'posts', postId.toString()),{
        data,
        postId: postId
      }).then((docRef)=>{
        console.log("Data saved properly", docRef);
      //  this.toastrservice.success("Data insert successfully");
      }).catch((err)=>{
        console.log(err);
      });
    }

    //load posts
  async  loadData(){
      const vas = await getDocs(query(collection(this.firestore, 'posts')));
      var data = vas.docs.map((propertie)=>propertie.data());
      console.log("Posts are ",data);
      return data;
    }

    //loadone post
    async loadOne(postID : any){
      const postRef = collection(this.firestore, 'posts');
      const postQuery = query(postRef, where('postID', '==', postID));
      const postSnapshot = await getDocs(postQuery);
     var postDetails : any[] = [];
     postSnapshot.forEach((propertyDoc) => {
      const propertyData = propertyDoc.data();
      postDetails.push(propertyData);
    });
      console.log("Return details ", postDetails);
      return postDetails;
    }


    updatePost(id: any, editdata: any){
      updateDoc(doc(this.firestore, 'posts', id.toString()), {
        editdata
      }).then((docRef)=>{
        console.log("Data added successfully", docRef);
      }, err=>{
        console.log("Error happened", err);
      });
    }

    markedFeatured(id: any, featureddata: any){
      updateDoc(doc(this.firestore, 'categories', id.toString()), {
        featureddata
      }).then((docRef)=>{
        console.log("Featured Status updated", docRef);
      }, err=>{
        console.log("Error happened", err);
      });

    }
  }
