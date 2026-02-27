import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeListComponent } from './employee-list.component';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { EmployeeService } from '@app/services/employee.service';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(async(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['deleteEmployee', 'getEmployees', 'getFilteredEmployees']);

    TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      imports: [
        ReactiveFormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: EmployeeService, useValue: mockEmployeeService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should delete an employee and reset the list', () => {
    mockEmployeeService.deleteEmployee.and.returnValue(of(null));
    spyOn(component, 'resetEmployeeList');
    component.deleteEmployee(1);
    expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(1);
    expect(component.resetEmployeeList).toHaveBeenCalled();
  });
});
