import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
import IUser from '../models/user';
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$!: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = this.db.collection<IUser>('users');
  }

   ngOnInit(): void {
    this.isAuthenticated$ = this.auth.pipe(
      map(user => !!user)
    );
  }

  async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password is required');
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );

    if (!userCred.user) {
      throw new Error(`User can't be found`);
    }

    const user = await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
      createdAt: new Date(),
    });

    await userCred.user?.updateProfile({
      displayName: userData.name,
    });

    return user;
  }
}
