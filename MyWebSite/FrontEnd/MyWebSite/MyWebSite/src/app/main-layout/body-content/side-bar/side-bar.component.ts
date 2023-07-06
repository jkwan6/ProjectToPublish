import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IElementDimensions } from '../../../interface/IElementDimensions';
import { SideNavService } from '../../../service/SideNavService/SideNavService';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  viewHeight!: number;
  constructor(private sideNavService : SideNavService) { }

  ngOnInit(): void {
    let sizes: IElementDimensions = this.sideNavService.getBodyDims.value;
    let sideBarContainer: HTMLDivElement = document.querySelector('.SideBarFlexContainer')!;

    this.sideNavService.getBodyDims.subscribe(
      results => {
        sizes = {
          width: results.width,
          height: results.height,
        };
        sideBarContainer.style.height = `${sizes.height}px`;
      }
    );
  }

}
