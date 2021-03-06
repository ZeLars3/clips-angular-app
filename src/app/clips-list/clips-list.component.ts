import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.scss']
})
export class ClipsListComponent implements OnInit, OnDestroy {

  constructor() { }
  
  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }
  
  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if (bottomOfWindow) {
      console.log('bottom of window');
    }
  }
  
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

}
