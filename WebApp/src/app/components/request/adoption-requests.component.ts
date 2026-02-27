import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Animal {
  id: number;
  animalType: number;
  status: string;
}

interface AdoptionRequest {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  sentAt: string;
  animal: Animal;
}

@Component({
  selector: 'app-adoption-requests',
  templateUrl: './adoption-requests.component.html',
  styleUrls: ['./adoption-requests.component.scss']
})
export class AdoptionRequestsComponent implements OnInit {
  requests: AdoptionRequest[] = [];
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.http.get<AdoptionRequest[]>('https://backendis-mjco.onrender.com/api/AdoptionRequests')
      .subscribe({
        next: data => {
          this.requests = data;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.errorMessage = 'Greška pri učitavanju zahteva.';
          this.loading = false;
        }
      });
  }

  approveRequest(requestId: number) {
    const index = this.requests.findIndex(r => r.id === requestId);
    if(index === -1) return;

    const removedRequest = this.requests.splice(index, 1)[0]; // uklanja odmah iz liste

    this.http.post(`https://backendis-mjco.onrender.com/api/AdoptionRequests/${requestId}/approve`, {})
      .subscribe({
        next: () => this.successMessage = 'Zahtev prihvaćen!',
        error: err => {
          console.error(err);
          this.errorMessage = 'Greška pri prihvatanju zahteva.';
          this.requests.push(removedRequest); // vrati zahtev ako je greška
        }
      });
  }

  

  rejectRequest(requestId: number) {
    const index = this.requests.findIndex(r => r.id === requestId);
    if(index === -1) return;

    const removedRequest = this.requests.splice(index, 1)[0]; // uklanja odmah iz liste

    this.http.post(`https://backendis-mjco.onrender.com/api/AdoptionRequests/${requestId}/reject`, {})
      .subscribe({
        next: () => this.successMessage = 'Zahtev odbijen!',
        error: err => {
          console.error(err);
          this.errorMessage = 'Greška pri odbijanju zahteva.';
          this.requests.push(removedRequest); // vrati zahtev ako je greška
        }
      });
  }

  closeMessage() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}