import { Component, Input } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() modalId: string = '';

  constructor(public modalService: ModalService) {}

  public onCloseModal() {
    this.modalService.toggleModal(this.modalId);
  }
}
