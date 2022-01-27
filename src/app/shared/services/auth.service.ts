import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import IUser from '../models/user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$!: Observable<boolean>;
  private redirect: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = this.db.collection<IUser>('users');
    this.isAuthenticated$ = this.auth.user.pipe(map((user) => !!user));
    // this.router.events.pipe(
    //   filter((event) => event instanceof NavigationEnd),
    //   map((event) => {
    //     this.route.firstChild}),
    //   switchMap((route) => route?.data ?? of({}))
    // ).subscribe((data) => {
    //   this.redirect = data.authOnly ?? false;
    // });
  }

  public async createUser(userData: IUser): Promise<void> {
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

  async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/']);
  }
}
