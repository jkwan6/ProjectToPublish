import { Component, OnInit } from '@angular/core';

interface card {
  title: string,
  body: string
};

type MatCardAppearance = 'outlined' | 'raised';

@Component({
  selector: 'app-blog-module',
  templateUrl: './blog-module.component.html',
  styleUrls: ['./blog-module.component.css']
})
export class BlogModuleComponent implements OnInit {

  constructor() { }

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
    {
      title: 'title5',
      body: 'body5'
    },

  ];

  ngOnInit(): void {
  }

}
