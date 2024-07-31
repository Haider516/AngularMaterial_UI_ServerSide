import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeWithCheckBoxComponent } from './tree-with-check-box.component';

describe('TreeWithCheckBoxComponent', () => {
  let component: TreeWithCheckBoxComponent;
  let fixture: ComponentFixture<TreeWithCheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeWithCheckBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeWithCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
