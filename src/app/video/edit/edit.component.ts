import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';
import IClip from '../../shared/models/clip';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/shared/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  public showAlert: boolean = false;
  public alertColor: string = 'blue';
  public alertMessage: string = 'Please wait...';
  public inSubmission: boolean = false;

  public editForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    clipId: new FormControl(''),
  });

  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ) {}

  public async onSubmit() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait...';

    try {
      await this.clipService.updateClip(
        this.editForm.controls['clipId'].value,
        this.editForm.controls['title'].value
      );
    } catch (error: any) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMessage = error.message;
      return;
    }

    this.activeClip.title = this.editForm.controls['title'].value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Clip updated successfully!';
  }

  public ngOnInit(): void {
    this.modalService.registerModal('editClip');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.editForm.controls['clipId'].setValue(this.activeClip.docId);
    this.editForm.controls['title'].setValue(this.activeClip.title);
  }

  public ngOnDestroy(): void {
    this.modalService.unregisterModal('editClip');
  }
}
