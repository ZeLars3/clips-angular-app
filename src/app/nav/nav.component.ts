import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/services/auth.service';
import { ModalService } from '../shared/services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private modalService: ModalService, public auth: AuthService) { }

  ngOnInit(): void {
  }

  onOpenModal(event: Event) {
    event.preventDefault();
    this.modalService.toggleModal('auth');
  }

  onLogout($event: Event) {
    $event.preventDefault();
    this.auth.logout();
  }

}
