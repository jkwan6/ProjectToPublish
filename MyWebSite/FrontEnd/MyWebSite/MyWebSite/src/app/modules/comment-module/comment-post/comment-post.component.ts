import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { IComments } from '../../../interface/IComments';
import { BaseRepository } from '../../../repository/BaseRepository';
import { SharedUtils } from '../../../SharedUtils/SharedUtils';

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

  constructor(
    private repository: BaseRepository<IComments>
  ) {
    this.baseUrl = "api/comments"
  }

  ngOnInit(): void {
    this.InitialializeFormGroup();
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
    $postComment.subscribe((results) => {});
  }

}
