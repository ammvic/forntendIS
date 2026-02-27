import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  private baseUrl = 'https://backendis-mjco.onrender.com/api/Tasks'; // prilagodi URL

  constructor(private http: HttpClient) {}

  getMyTasks() {
    return this.http.get<any[]>(`${this.baseUrl}/my-tasks`);
  }

  toggleTask(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/toggle`, {});
  }
}
