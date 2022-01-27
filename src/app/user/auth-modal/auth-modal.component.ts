import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
})
export class AuthModalComponent implements OnInit, OnDestroy {
  constructor(private modalService: ModalService) {}

  public ngOnInit(): void {
    this.modalService.registerModal('auth');
  }

  public ngOnDestroy(): void {
    this.modalService.unregisterModal('auth');
  }
}
