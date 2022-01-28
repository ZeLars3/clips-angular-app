import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/shared/services/clip.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent implements OnDestroy {
  public isDraggingOver: boolean = false;
  private file: File | null = null;
  public next: boolean = false;
  public showAlert: boolean = false;
  public alertColor: string = 'blue';
  public alertMessage: string = 'Please wait...';
  public inSubmission: boolean = false;
  public percentage: number = 0;
  public showPercentage: boolean = false;
  private user: firebase.User | null = null;
  private task?: AngularFireUploadTask;

  public uploadForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
  ) {
    auth.user.subscribe((user) => {
      this.user = user;
    });
  }
  
  public storeFile($event: Event): void {
    this.isDraggingOver = false;
    this.file = ($event as DragEvent).dataTransfer
    ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    : ($event.target as HTMLInputElement).files?.item(0) ?? null;
    
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    
    this.uploadForm.controls['title'].setValue(this.file.name);
    
    this.next = true;
  }
  
  public onUploadFile(): void {
    this.uploadForm.enable();
    
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait...';
    this.inSubmission = true;
    this.showPercentage = false;
    
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}`;
    
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    
    this.task.percentageChanges().subscribe((percentage) => {
      this.percentage = (percentage as number) / 100;
    });
    
    this.task
    .snapshotChanges()
    .pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid ?? '',
            displayName: this.user?.displayName ?? '',
            title: this.uploadForm.controls['title'].value,
            fileName: `${clipFileName}.mp4`,
            url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          
          const clipDocRef = await this.clipService.createClip(clip);
          
          console.log(clip);
          
          this.alertColor = 'green';
          this.alertMessage = 'Your clip has been uploaded!';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['/clip', clipDocRef.id]);
          }, 1000);  
        },
        error: (error: any) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMessage = 'An error occurred while uploading your clip.';
          this.inSubmission = true;
          this.showPercentage = false;
          
          console.error(error);
        },
      });
    }

  public ngOnDestroy(): void {
    this.task?.cancel();
  }
}
