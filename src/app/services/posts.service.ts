import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteField, doc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore';
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
      setDoc(doc(this.firestore, 'blogs', postId.toString()),{
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
      const vas = await getDocs(query(collection(this.firestore, 'blogs')));
      var data = vas.docs.map((propertie)=>propertie.data());
      console.log("Posts are ",data);
      return data;
    }

    //loadone post
    async loadOne(postID : any){
      const postId = Number(postID);
      console.log(";ll", typeof postId);
      const postRef = collection(this.firestore, 'blogs');
      console.log("Collection reference:", postRef);
      const postQuery = query(postRef, where('postId', '==', postId));
      console.log("Query details:", postQuery);
      try {
        // Fetch documents
        const postSnapshot = await getDocs(postQuery);
        const postDetails: any[] = [];
    
        if (postSnapshot.empty) {
          console.log("No matching documents found!");
          return [];
        }
    
        // Process the returned documents
        postSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Document data:", data);
          postDetails.push(data);
        });
    
        console.log("Returning details:", postDetails);
        return postDetails;
      } catch (error) {
        console.error("Error fetching document:", error);
        return [];
      }

    }


    updatePost(id: any, editdata: any){
      updateDoc(doc(this.firestore, 'blogs', id.toString()), {
        editdata
      }).then((docRef)=>{
        console.log("Data added successfully", docRef);
      }, err=>{
        console.log("Error happened", err);
      });
    }

    markedFeatured(id: any, featureddata: any){
      updateDoc(doc(this.firestore, 'blogs', id.toString()), {
        featureddata
      }).then((docRef)=>{
        console.log("Featured Status updated", docRef);
      }, err=>{
        console.log("Error happened", err);
      });

    }

//load featured 
async loadFeatured(){

    const featuredRef = collection(this.firestore, 'blogs');
    const featuredQuery = query(featuredRef, where('isFeatured', '==', 'True'), limit(4));
    const featuredSnapshot = await getDocs(featuredQuery);
   var featuredDetails : any[] = [];
   featuredSnapshot.forEach((propertyDoc) => {
    const propertyData = propertyDoc.data();
    featuredDetails.push(propertyData);
  });
    console.log("Return featured details ", featuredDetails);
    return featuredDetails;
  }


  //load Category
  async loadCategoryPost(categoryId : any){
    const categoryRef = collection(this.firestore, 'blogs');
    const categoryQuery = query(categoryRef, where('category.categoryId', '==', categoryId));
    const categorySnapshot = await getDocs(categoryQuery);
    var categoryDetails : any[] = [];
    categorySnapshot.forEach((propertyDoc) => {
     const propertyData = propertyDoc.data();
     categoryDetails.push(propertyData);
   });
     console.log("Return category details ", categoryDetails);
     return categoryDetails;
  }


  //load similar 
 async loadSimilar(catId : any){
    const catRef = collection(this.firestore, 'blogs');
    const catQuery = query(catRef, where('category.categoryId', '==', catId));
    const catSnapshot = await getDocs(catQuery);
    var catDetails : any[] = [];
    catSnapshot.forEach((propertyDoc) => {
     const propertyData = propertyDoc.data();
     catDetails.push(propertyData);
   });
     console.log("Return similar cat details ", catDetails);
     return catDetails;
  }
  }
