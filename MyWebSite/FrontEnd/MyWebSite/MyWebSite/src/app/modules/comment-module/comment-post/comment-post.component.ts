import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { IComments } from '../../../interface/IComments';
import { BaseRepository } from '../../../repository/BaseRepository';
import { AuthenticationService } from '../../../service/AuthenticationService/AuthenticationService';
import { SharedUtils } from '../../../shared-utils/SharedUtils';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SideNavService } from '../../../service/SideNavService/SideNavService';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-post',
  templateUrl: './comment-post.component.html',
  styleUrls: ['./comment-post.component.css'],
  providers: [BaseRepository]
})
export class CommentPostComponent implements OnInit {

  formVariable!: IComments ;     // Update Type Based on Form Parameters
  form!: FormGroup;             // ReactiveForm
  testArray!: string[];
  baseUrl: string;
  textAreaValue: string;
  isLoggedIn!: boolean;

  // TINYMCE START
  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'lists link image table wordcount',
    /*    branding: false,*/
    promotion: false,
    content_css: "./tinyMCE/TinyMCE.css"
  };
  subscription!: Subscription;
  editorContent?: string;
  testVariable: any;
  themeStatus$!: BehaviorSubject<boolean>;
  // TINYMCE END

  constructor(
    private sanitizer: DomSanitizer,
    private repository: BaseRepository<IComments, IComments>,
    private authStateService: AuthenticationService,
    private router: Router,
    private sideNavService: SideNavService
  ) {
    authStateService.$authState.subscribe(results => this.isLoggedIn = results);
    this.baseUrl = "api/comments"
    this.textAreaValue = "";
  }

  ngOnInit(): void {
    this.InitialializeFormGroup();


    //let sideBarContainer: HTMLDivElement = document.querySelector('.LayoutFlexContainer')!;
    //this.subscription = this.sideNavService.$themeLocalStorage.subscribe(results => {
    //  console.log(`results: ${results}`)
    //  if (results) {
    //    this.editorConfig.skin = 'oxide-dark';
    //  }
    //  else {
    //    this.editorConfig.skin = 'naked';
    //  }
    //})

  }

  // #region --> Code Module to Initialize FormGroup
  private InitialializeFormGroup() {

    this.formVariable = { commentsDescription: "" };            // Gotta initialize First

    this.form = new FormGroup({});
    // Add Parameters to Form Group
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.commentsDescription),    // Update Property Here
      new FormControl("", Validators.required)                              // "" To initialize empty form
    );
  }
  // #endregion

  // Assign User Values from UI to class property
  public onSubmit() {
    this.formVariable = {
      commentsDescription:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.commentsDescription)].value,
    }
    this.sendRequest();
  }

  sendRequest() {
    var url = environment.baseUrl + this.baseUrl;
    var $postComment = this.repository.PostItem(url, this.formVariable);
    $postComment.subscribe((results) => {
    });
  }

  clearTextArea() {
    this.form.reset();
  }

  //////// TINYMCE START

  getContent() {
    console.log(this.editorContent)
    var test = this.sanitizer.bypassSecurityTrustHtml(this.editorContent!)
    this.testVariable = test;
  }

}
