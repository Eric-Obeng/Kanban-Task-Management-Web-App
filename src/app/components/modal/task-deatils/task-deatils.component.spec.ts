import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDeatilsComponent } from './task-deatils.component';

describe('TaskDeatilsComponent', () => {
  let component: TaskDeatilsComponent;
  let fixture: ComponentFixture<TaskDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDeatilsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
