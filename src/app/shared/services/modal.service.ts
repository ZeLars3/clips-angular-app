import { Injectable } from '@angular/core';
import { IModal } from '../models/modal.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  visible = false;
  private modals: IModal[] = [];

  constructor() { }

  isModalOpen(id: string): boolean {
    return !!this.modals.find(modal => modal.id === id)?.visible;
  }
   

  toggleModal(id: string) {
    const modal = this.modals.find(modal => modal.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }

  registerModal(id: string) {
    this.modals.push({ id: id, visible: false });
  }

  unregisterModal(id: string) {
    this.modals = this.modals.filter(modal => modal.id !== id);
  }
}
