// employee-tasks.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Task {
  id: number;
  employeeId: string;
  taskDescription: string;
  assignedDate: string;
  dueDate: string;
  isCompleted: boolean;
  employeeFirstName: string;
  employeeLastName: string;
}

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrls: ['./employee-tasks.component.scss']
})
export class EmployeeTasksComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  employeeId = ''; // Uzmi iz auth servisa
  private apiUrl = 'https://backendis-mjco.onrender.com'; // Promeni na svoj API URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Izvuci userId iz JWT tokena
    const token = localStorage.getItem('token');
    if (token) {
      this.employeeId = this.getUserIdFromToken(token);
    }
    
    // DEBUG
    console.log('Employee ID:', this.employeeId);
    console.log('Token:', token);
    
    if (this.employeeId) {
      this.loadTasks();
    } else {
      this.error = 'Nije pronađen ID korisnika u tokenu';
    }
  }

  getUserIdFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload); // DEBUG
      
      // ClaimTypes.NameIdentifier mapira se na ovaj claim
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
             payload.sub || 
             payload.nameid || 
             '';
    } catch (e) {
      console.error('Greška pri parsiranju tokena:', e);
      return '';
    }
  }

  loadTasks() {
    this.loading = true;
    this.error = '';

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/api/Tasks/employee/${this.employeeId}`;
    console.log('Calling URL:', url); // DEBUG

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        console.log('Response:', data); // DEBUG
        // Ako backend vraća { tasks: [...] } umesto samo [...]
        this.tasks = Array.isArray(data) ? data : (data.tasks || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error details:', err); // DEBUG
        this.error = 'Greška pri učitavanju zadataka';
        this.loading = false;
      }
    });
  }

  toggleTask(taskId: number) {
    const token = localStorage.getItem('token');
    console.log('Toggle - Token:', token); // DEBUG
    console.log('Toggle - TaskId:', taskId); // DEBUG
    
    if (!token) {
      alert('Niste ulogovani');
      return;
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}/api/Tasks/${taskId}/toggle`;
    console.log('Toggle URL:', url); // DEBUG

    this.http.put(url, {}, { headers }).subscribe({
      next: (response: any) => {
        console.log('Toggle response:', response); // DEBUG
        // Ažuriraj task u listi
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
          task.isCompleted = !task.isCompleted;
        }
      },
      error: (err) => {
        console.error('Toggle error:', err); // DEBUG
        console.error('Error status:', err.status); // DEBUG
        console.error('Error message:', err.message); // DEBUG
        alert('Greška pri promeni statusa zadatka: ' + (err.error?.message || err.message));
      }
    });
  }

  getStatusClass(isCompleted: boolean): string {
    return isCompleted ? 'completed' : 'pending';
  }

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date() && !this.tasks.find(t => t.dueDate === dueDate)?.isCompleted;
  }
}