import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '@app/services/employee.service';
import { Employee } from '@app/models/user';
import { EmployeeDialogComponent } from './employee-dialog.component';
import { HttpClient } from '@angular/common/http';
import { AssignTaskDialogComponent } from './assign-task-dialog.component';
@Component({
  selector: 'app-employee',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'role',
    'employmentDate',
    'icons',
    'assignTask'
  ];
  dataSource = new MatTableDataSource<Employee>();
  

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  // Učitaj zaposlene
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        const nonAdminEmployees = employees.filter(emp => emp.role !== 'Admin');
        this.dataSource.data = nonAdminEmployees;
      },
      error: () => {
        this.snackBar.open('Greška prilikom dohvaćanja zaposlenih.', 'Zatvori', { duration: 3000 });
      }
    });
  }

  // Dodaj zaposlenog
  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '400px',
      data: { employee: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.addEmployee(result).subscribe({
          next: () => {
            this.snackBar.open('Zaposleni uspešno dodat.', 'Zatvori', { duration: 3000 });
            this.loadEmployees();
          },
          error: () => {
            this.snackBar.open('Greška prilikom dodavanja zaposlenog.', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }

  // Izmeni zaposlenog
editEmployee(employee: Employee): void {
  const dialogRef = this.dialog.open(EmployeeDialogComponent, {
    width: '400px',
    data: { employee }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Pozivamo backend koji updateuje po imenu i prezimenu
      this.http.put('https://backendis-mjco.onrender.com/api/users/update-by-name', result)
        .subscribe({
          next: () => {
            this.snackBar.open('Zaposleni uspešno izmenjen.', 'Zatvori', { duration: 3000 });
            this.loadEmployees(); // osvežavanje tabele
          },
          error: () => {
            this.snackBar.open('Greška prilikom izmene zaposlenog.', 'Zatvori', { duration: 3000 });
          }
        });
    }
  });
}



  // Obriši zaposlenog
  deleteEmployee(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete zaposlenog?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.snackBar.open('Zaposleni uspešno obrisan.', 'Zatvori', { duration: 3000 });
          this.loadEmployees();
        },
        error: () => {
          this.snackBar.open('Greška prilikom brisanja zaposlenog.', 'Zatvori', { duration: 3000 });
        }
      });
    }
  }

  
  

  // Dodeli zadatak zaposlenom
 assignTask(employee: any): void {
  const dialogRef = this.dialog.open(AssignTaskDialogComponent, {
    width: '400px',
    data: employee
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.task) {
      // ovde možeš da pošalješ zahtev backendu da dodeliš zadatak
      console.log(`Zadatak za ${employee.firstName}:`, result.task);
      // npr. this.employeeService.assignTask(employee.id, result.task).subscribe(...)
    }
  });
}}
  
