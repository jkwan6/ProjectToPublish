import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-tiny-mce-module',
  templateUrl: './tiny-mce-module.component.html',
  styleUrls: ['./tiny-mce-module.component.css']
})
export class TinyMceModuleComponent implements OnInit {

  // TINYMCE START
  editorConfig = {
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


  constructor(private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
  }


  //////// TINYMCE START

  getContent() {
    console.log(this.editorContent)
    var test = this.sanitizer.bypassSecurityTrustHtml(this.editorContent!)
    this.testVariable = test;
  }

}
