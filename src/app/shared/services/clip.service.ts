import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { map, of, switchMap } from 'rxjs';

import IClip from '../models/clip';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
    this.clipsCollection = db.collection('clips');
  }

  public createClip(clip: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(clip);
  }

  public getUserClips() {
    return this.auth.user.pipe(
      switchMap((user) => {
        if (user) {
          return this.clipsCollection.ref.where('userId', '==', user.uid).get();
        } else {
          return of([]);
        }
      }),
      map((snapshot) => {
        (snapshot as QuerySnapshot<IClip>).docs;
      })
    );
  }

  public updateClip(id: string, title: string) {
    return  this.clipsCollection.doc(id).update({
      title
    });
  }
}
