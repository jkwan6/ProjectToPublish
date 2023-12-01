import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OIDCComponent } from './oidc.component';

describe('OIDCComponent', () => {
  let component: OIDCComponent;
  let fixture: ComponentFixture<OIDCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OIDCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OIDCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
