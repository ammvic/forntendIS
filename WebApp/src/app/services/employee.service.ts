import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '@app/models/user';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://backendis-mjco.onrender.com/api/Users/all-users'; // URL za API backend

  constructor(private http: HttpClient) {}

  // Dohvati sve zaposlene
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}`);
  }

  // Dohvati zaposlene prema filteru (datum od-do)
  getFilteredEmployees(fromDate: string, toDate: string): Observable<Employee[]> {
    let params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<Employee[]>(`${this.apiUrl}/filter`, { params });
  }

  // Dohvati zaposlenog prema ID-u
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  // Dodaj novog zaposlenog
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}`, employee);
  }

  // Ažuriraj podatke o zaposlenom
  updateEmployee(id: number, employee: Employee): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee);
  }

  // Obrisi zaposlenog prema ID-u
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignTask(employeeId: number, taskDetails: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${employeeId}/assign-task`, { task: taskDetails });
  }
}
