import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { IComments } from '../interface/IComments';
import { IPageParams } from '../interface/IPageParams';
import { BaseRepository } from '../repository/BaseRepository';
import { MatCarousel, MatCarouselComponent, Orientation } from '@ngbmodule/material-carousel'
import { ThemePalette } from '@angular/material/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface card {
  title: string,
  body: string
};

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [BaseRepository]
})
export class HomePageComponent implements OnInit {
  
  cards: card[] = [
    {
      title: 'title1',
      body: 'body1'
    },
    {
      title: 'title2',
      body: 'body2'
    },
    {
      title: 'title3',
      body: 'body3'
    },
    {
      title: 'title4',
      body: 'body4'
    },
    {
      title: 'title5',
      body: 'body5'
    },
    {
      title: 'title5',
      body: 'body5'
    },
    {
      title: 'title5',
      body: 'body5'
    },
    {
      title: 'title5',
      body: 'body5'
    },
    {
      title: 'title5',
      body: 'body5'
    },
    {
      title: 'title5',
      body: 'body5'
    },
  ];


  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }







}
