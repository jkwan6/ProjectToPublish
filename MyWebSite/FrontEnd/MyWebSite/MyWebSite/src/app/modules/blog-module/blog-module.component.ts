import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { IApiObject } from '../../interface/IApiObject';
import { IBlog } from '../../interface/IBlog';
import { IPageParams } from '../../interface/IPageParams';
import { BaseRepository } from '../../repository/BaseRepository';

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
export class BlogModuleComponent implements AfterViewInit {

  constructor(
    private repository: BaseRepository<IApiObject<IBlog[]>, IApiObject<IBlog[]>>,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {
    this.blogRepository$ = this.repository.GetAll("url", this.params)
    this.url = "api/blog" // Gotta Refactor
  }
 
  // #region Properties
  url!: string
  blogRepository$: Observable<IApiObject<IBlog[]>>
  public displayedColumns: string[] = ["BlogDefinition"];     // Not sure why we need that
  public Blogs!: MatTableDataSource<IBlog>;                   // Generic Class from AngMat Table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  params: IPageParams =
    {
      pageIndex: 0,
      pageSize: 5,
      filterColumn: "id",
      sortColumn: "id",
      sortOrder: "desc",
      filterQuery: ""
    }

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

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.url = environment.baseUrl + this.url;
    this.loadData();
  };

  loadData(event?: PageEvent) {
    this.setPaginatorValues();
    var obs = this.repository.GetAll(this.url, this.params);

    obs.pipe(tap(results => {
      results.objects.forEach(blogEntry => {
        blogEntry.blogBody = this.sanitizer.bypassSecurityTrustHtml(blogEntry.blogBody as string);
      })
    })).subscribe(results => {
      this.paginator.length = results.count;
      this.paginator.pageIndex = this.params.pageIndex;
      this.paginator.pageSize = this.params.pageSize;
      this.Blogs = new MatTableDataSource<IBlog>(results.objects);
      console.log(this.Blogs.filteredData)
    })
  }

  //getContent() {
  //  console.log(this.editorContent)
  //  var test = this.sanitizer.bypassSecurityTrustHtml(this.editorContent!)
  //  this.testVariable = test;
  //  let abcd: SafeHtml;
  //  abcd = test;
  //}


  setPaginatorValues() {
    var sortColumn = (this.sort) ? this.sort.active : this.params.sortColumn;      // Active is the Current string
    var sortOrder = (this.sort) ? this.sort.direction : this.params.sortOrder;    // Direction is Ascending/Descending
    var filterQuery = (this.params.filterQuery) ? this.params.filterQuery : null;
    var filterColumn = (this.params.filterColumn) ? this.params.filterColumn : null;

    this.params.sortOrder = sortOrder;
    this.params.sortColumn = sortColumn;
    this.params.filterQuery = (filterQuery) ? filterQuery : "";
    this.params.sortColumn = filterColumn ? filterColumn : "";
    this.params.pageSize = this.paginator.pageSize;
    this.params.pageIndex = this.paginator.pageIndex;
  }

}
