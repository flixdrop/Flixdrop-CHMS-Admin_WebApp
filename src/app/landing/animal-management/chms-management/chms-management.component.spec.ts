import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChmsManagementComponent } from './chms-management.component';

describe('ChmsManagementComponent', () => {
  let component: ChmsManagementComponent;
  let fixture: ComponentFixture<ChmsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChmsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChmsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
