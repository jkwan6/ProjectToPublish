import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyMceModuleComponent } from './tiny-mce-module.component';

describe('TinyMceModuleComponent', () => {
  let component: TinyMceModuleComponent;
  let fixture: ComponentFixture<TinyMceModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TinyMceModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TinyMceModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
