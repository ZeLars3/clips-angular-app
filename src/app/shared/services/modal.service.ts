import { Injectable } from '@angular/core';
import IModal from '../models/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private visible: boolean = false;
  private modals: IModal[] = [];

  public isModalOpen(id: string): boolean {
    return !!this.modals.find(modal => modal.id === id)?.visible;
  }
   

  public toggleModal(id: string): void {
    const modal = this.modals.find(modal => modal.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }

  public registerModal(id: string): void {
    this.modals.push({ id: id, visible: false });
  }

  public unregisterModal(id: string): void {
    this.modals = this.modals.filter(modal => modal.id !== id);
  }
}
