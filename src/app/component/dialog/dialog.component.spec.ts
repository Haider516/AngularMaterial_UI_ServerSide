import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogElementsExample } from './dialog.component';

describe('DialogElementsExample', () => {
  let component: DialogElementsExample;
  let fixture: ComponentFixture<DialogElementsExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogElementsExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogElementsExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
