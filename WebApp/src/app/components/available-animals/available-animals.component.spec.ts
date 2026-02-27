import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableAnimalsComponent } from './available-animals.component';

describe('AvailableAnimalsComponent', () => {
  let component: AvailableAnimalsComponent;
  let fixture: ComponentFixture<AvailableAnimalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableAnimalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableAnimalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
