import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBlog } from '../../interface/IBlog';
import { BaseRepository } from '../../repository/BaseRepository';
import { AuthenticationService } from '../../service/AuthenticationService/AuthenticationService';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-tiny-mce-module',
  templateUrl: './tiny-mce-module.component.html',
  styleUrls: ['./tiny-mce-module.component.css']
})
export class TinyMceModuleComponent implements OnInit {

  // TINYMCE START
  editorConfig = {
    selector: 'textarea',
    images_upload_url: 'postAcceptor.php',
    images_upload_base_path: '/some/basepath',
    images_upload_credentials: true,
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'lists link image table wordcount',
    skin: 'oxide',
    /*    branding: false,*/
    promotion: false,
    content_css: 'assets/tinyMCE/TinyMCE.css',
    height: '400'
  };
  subscription!: Subscription;
  editorContent?: string;
  testVariable: any;
  themeStatus$!: BehaviorSubject<boolean>;
  // TINYMCE END

  formVariable!: IBlog;     // Update Type Based on Form Parameters
  testArray!: string[];
  baseUrl: string;
  textAreaValue: string;
  isLoggedIn!: boolean;
  editorTest!: EditorComponent;

  constructor(
    private sanitizer: DomSanitizer,
    private repository: BaseRepository<IBlog, IBlog>,
    private authStateService: AuthenticationService,
    private router: Router,
    private sideNavService: SideNavService)
  {
    authStateService.$authState.subscribe(results => this.isLoggedIn = results);
    this.baseUrl = "api/blog"
    this.textAreaValue = "";
}

  ngOnInit(): void {
  }


  //////// TINYMCE START

  getContent() {
    console.log(this.editorContent)
    var test = this.sanitizer.bypassSecurityTrustHtml(this.editorContent!)
    this.testVariable = test;
    let abcd: SafeHtml;
    abcd = test;
  }

  public onSubmit() {
    console.log(this.editorContent)
    var test = this.sanitizer.bypassSecurityTrustHtml(this.editorContent!)
    this.testVariable = test;

    this.formVariable = {
      author: 'string',
      blogTitle: 'string',
      blogBody: this.editorContent!,

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
  }


}
