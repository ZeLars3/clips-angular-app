import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  public videoOrder: string = '1';

  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
    });
  }

  public onSort(event: Event): void {
    const { value } = event.target as HTMLInputElement;

    this.router.navigate(['/clips']);
  }
}
