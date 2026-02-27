import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NotificationDialogComponent } from './notification-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-assign-task-dialog',
  templateUrl: './assign-task-dialog.component.html',
  styleUrls: ['./assign-task-dialog.component.scss']
})
export class AssignTaskDialogComponent {
  taskDescription: string = '';
  dueDate: Date | null = null; // dodat rok

  constructor(
    private dialogRef: MatDialogRef<AssignTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  onAssign() {
    if (!this.taskDescription || !this.dueDate) return; // validacija

    const taskPayload = {
      taskDescription: this.taskDescription,
      dueDate: this.dueDate.toISOString() // backend očekuje ISO string
    };

    const employeeId = this.data.id;

    this.http.post(`https://backendis-mjco.onrender.com/api/Tasks/assign/${employeeId}`, taskPayload)
      .subscribe({
        next: () => {
          this.dialog.open(NotificationDialogComponent, {
            data: { message: `Zadatak dodeljen zaposlenom ${this.data.firstName} ${this.data.lastName}.` }
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          alert('Greška prilikom dodele zadatka.');
        }
      });
  }
}
