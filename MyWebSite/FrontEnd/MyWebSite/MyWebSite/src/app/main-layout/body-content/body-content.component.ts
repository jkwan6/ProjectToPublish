import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { IBodyDimensions } from '../../interface/IBodyDimensions';
import { SideNavService } from '../../service/SideNavService/SideNavService';



@Component({
  selector: 'app-body-content',
  templateUrl: './body-content.component.html',
  styleUrls: ['./body-content.component.css']
})
export class BodyContentComponent implements AfterViewInit {

  @ViewChild(MatDrawer) matDrawer!: MatDrawer;
  @ViewChild('bodyElement') bodyElement!: ElementRef;
  @ViewChild('container') containerElement!: ElementRef;


  bodyElementDim!: IBodyDimensions;

  constructor(private sideNavService: SideNavService) {}

  showFiller = false;
  subscription!: Subscription;
  toggleStatus!: boolean;

  ngAfterViewInit(): void {
    this.subscription = this.sideNavService.currentToggleStatus$.subscribe(x => this.matDrawer.toggle(x.valueOf()))

    this.bodyElementDim = { height: this.bodyElement!.nativeElement.offsetHeight, width: this.bodyElement!.nativeElement.offsetWidth };
    this.sideNavService.setBodyDims = this.bodyElementDim;
    const element: Element = document.getElementById('bodyElement')!;
    new ResizeObserver(this.outputsize).observe(element)

    var mouse: { x: number, y: number } = { x: 0, y: 0 };

    //element!.addEventListener('mousemove', (event: any) => {
    //  //console.log("mosuemove")
    //  mouse.x = (event.layerX / this.bodyElement!.nativeElement.offsetWidth - 0.5) * 2;
    //  mouse.y = - (event.layerY / this.bodyElement!.nativeElement.offsetHeight - 0.5) * 2;
    //  console.log(mouse)
    //});

  }

  outputsize: () => void = (): void => {
    this.bodyElementDim.height = this.bodyElement!.nativeElement.offsetHeight;
    this.bodyElementDim.width = this.bodyElement!.nativeElement.offsetWidth;
    this.sideNavService.setBodyDims = this.bodyElementDim;
  }

}
