import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modal.service';


@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit, OnDestroy {

  constructor(private modalService: ModalService) { }
  
  ngOnInit(): void {
    this.modalService.registerModal('auth');
  }
  
  ngOnDestroy(): void {
    this.modalService.unregisterModal('auth');
  }
}
