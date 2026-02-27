// notification-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  template: `
    <div class="notification-dialog">
      <h2 class="title">✅ Zadatak poslat!</h2>
      <p class="message">{{ data.message }}</p>
      <div class="actions">
        <button mat-raised-button color="primary" (click)="dialogRef.close()">OK</button>
      </div>
    </div>
  `,
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
