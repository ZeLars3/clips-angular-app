import { Component } from '@angular/core';

import { AuthService } from '../shared/services/auth.service';
import { ModalService } from '../shared/services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent {
  constructor(private modalService: ModalService, public auth: AuthService) {}

  onOpenModal(event: Event) {
    event.preventDefault();
    this.modalService.toggleModal('auth');
  }

  async onLogout($event: Event) {
    $event.preventDefault();
    await this.auth.logout();
  }
}
