import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, forkJoin, last, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/shared/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/shared/services/ffmpeg.service';

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
  public screenshots: string[] = [];
  public selectedScreenshot: string = '';
  private screenshotTaks?: AngularFireUploadTask;

  public uploadForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    public ffmpeg: FfmpegService
  ) {
    auth.user.subscribe((user) => {
      this.user = user;
    });
    this.ffmpeg.init();
  }

  public async storeFile($event: Event): Promise<void> {
    if (this.ffmpeg.isRunning) {
      return;
    }

    this.isDraggingOver = false;
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    //this.screenshots = await this.ffmpeg.getScreenshots(this.file);

    this.selectedScreenshot = this.screenshots[0];

    this.uploadForm.controls['title'].setValue(this.file.name);

    this.next = true;
  }

  public async onUploadFile(): Promise<void> {
    this.uploadForm.enable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait...';
    this.inSubmission = true;
    this.showPercentage = false;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}`;

    const screenshotBlob = await this.ffmpeg.blobFromURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${clipFileName}.jpg`;

    this.screenshotTaks = this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.screenshotTaks = this.storage.upload(screenshotPath, screenshotBlob);

    const screenShotRef = this.storage.ref(screenshotPath);

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTaks.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;

      if (!clipProgress || !screenshotProgress) {
        return;
      }

      const totalProgress = clipProgress + screenshotProgress;

      this.percentage = (progress as unknown as number) / 100;
    });

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTaks.snapshotChanges(),
    ])
      .pipe(
        last(),
        switchMap(() => forkJoin([clipRef.getDownloadURL(), screenShotRef.getDownloadURL()]))
      )
      .subscribe({
        next: async (urls) => {
          const[clipUrl, screenshotUrl] = urls;

          const clip = {
            uid: this.user?.uid ?? '',
            displayName: this.user?.displayName ?? '',
            title: this.uploadForm.controls['title'].value,
            fileName: `${clipFileName}.mp4`,
            url: clipUrl,
            screenshotUrl,
            screenshotFileName: `${clipFileName}.jpg`,
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
