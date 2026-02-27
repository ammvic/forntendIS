import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '@app/models/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss']
})
export class EmployeeDialogComponent {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee | null }
  ) {
    this.employeeForm = this.fb.group({
      firstName: [data.employee?.firstName || '', Validators.required],
      lastName: [data.employee?.lastName || '', Validators.required],
      role: [data.employee?.role || '', Validators.required],
      employmentDate: [
        data.employee?.employmentDate
          ? new Date(data.employee.employmentDate).toISOString().substring(0, 10)
          : '',
        Validators.required
      ]
    });
  }

 save(): void {
  if (this.employeeForm.valid) {
    const formValue = this.employeeForm.value;

    // Pretvori datum iz 'yyyy-MM-dd' u ISO string sa vremenom
    const employmentDateISO = new Date(formValue.employmentDate).toISOString();

    const employeeData = {
      ...formValue,
      employmentDate: employmentDateISO
    };

    if (this.data.employee) {
      // Izmena zaposlenog
      this.http.put('https://backendis-mjco.onrender.com/api/users/update-by-name', employeeData)
        .subscribe({
          next: () => this.dialogRef.close(employeeData),
          error: (err) => console.error(err)
        });
    } else {
      // Dodavanje zaposlenog
      this.http.post('https://backendis-mjco.onrender.com/api/users/register', employeeData)
        .subscribe({
          next: () => this.dialogRef.close(employeeData),
          error: (err) => console.error(err)
        });
    }
  }
}


  close(): void {
    this.dialogRef.close();
  }
}
