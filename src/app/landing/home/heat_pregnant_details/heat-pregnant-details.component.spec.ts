import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HeatPregnantDetailsComponent } from './heat-pregnant-details.component';

describe('HeatPregnantDetailsComponent', () => {
  let component: HeatPregnantDetailsComponent;
  let fixture: ComponentFixture<HeatPregnantDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatPregnantDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeatPregnantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
