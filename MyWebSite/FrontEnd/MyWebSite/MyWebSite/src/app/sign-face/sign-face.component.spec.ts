import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignFaceComponent } from './sign-face.component';

describe('SignFaceComponent', () => {
  let component: SignFaceComponent;
  let fixture: ComponentFixture<SignFaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignFaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
