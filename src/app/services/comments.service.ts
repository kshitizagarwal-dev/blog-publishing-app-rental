import { formatCurrency } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private firestore : Firestore = inject(Firestore);
  constructor() { }

  //load comments from firestore 
  loadComments(){
    
  }
}
