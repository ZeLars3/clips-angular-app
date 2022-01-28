import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import IClip from 'src/app/shared/models/clip';
import { ClipService } from 'src/app/shared/services/clip.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  public videoOrder: string = '1';
  public clips: IClip[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private clipService: ClipService) {}

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
    });
    
    this.clipService.getUserClips().subscribe((docs) => {
      this.clips = [];

      const clips = docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        };
      });

      this.clips = clips;
    });

    //   docs.forEach((doc: any) => {
    //     this.clips.push({
    //       docId: doc.id,
    //       ...doc.data()
    //     });
    //   });
    // });
  }

  public onSort(event: Event): void {
    const { value } = event.target as HTMLInputElement;

    this.router.navigate(['/clips']);
  }
}
