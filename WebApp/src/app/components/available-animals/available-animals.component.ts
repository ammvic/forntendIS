import { Component, OnInit } from '@angular/core';
import { AnimalService } from '@app/services/animal.service';
import { Animal } from '@app/models/animal';
import { AdoptionRequestDto } from '@app/models/adoption-request';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-available-animals',
  templateUrl: './available-animals.component.html',
  styleUrls: ['./available-animals.component.scss']
})
export class AvailableAnimalsComponent implements OnInit {

  animals: Animal[] = [];
  selectedAnimal: Animal | null = null;

  animalTypeMap: { [key: number]: string } = {
  0: 'Pas',
  1: 'Mačka',
  2: 'Drugo'
};


  form: { fullName: string; email: string; phone?: string } = {
    fullName: '',
    email: '',
    phone: ''
  };
successModal = false;

filters = {
  type: '',
  gender: '',
  city: ''
};

filteredAnimals: Animal[] = [];


  constructor(private animalService: AnimalService, private http: HttpClient,) { }

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals() {
  this.animalService.getAvailableAnimals().subscribe(
    data => {
      this.animals = data;
      this.filteredAnimals = [...this.animals]; // inicijalno sve
    },
    err => console.error(err)
  );
}

applyFilters() {
  this.filteredAnimals = this.animals.filter(a => {
    const typeMatch = this.filters.type === '' || a.animalType.toString() === this.filters.type;
    const genderMatch = this.filters.gender === '' || a.gender.toString() === this.filters.gender;
    const cityMatch = this.filters.city === '' ||
                      a.admissionCity.toLowerCase().includes(this.filters.city.toLowerCase());

    return typeMatch && genderMatch && cityMatch;
  });
}


  openAdoptModal(animal: Animal) {
    this.selectedAnimal = animal;
    this.form = { fullName: '', email: '', phone: '' }; // resetuj form
  }

  sendRequest() {
  const body = {
    animalId: this.selectedAnimal.id,
    fullName: this.form.fullName,
    email: this.form.email,
    phone: this.form.phone
  };

  this.http.post('https://backendis-mjco.onrender.com/api/AdoptionRequests', body)
    .subscribe({
      next: () => {
        this.selectedAnimal = null;  
        this.successModal = true;     // OTVARA MODAL
      },
      error: err => {
        console.error(err);
      }
    });
}


  cancel() {
    this.selectedAnimal = null;
  }

 getAnimalImageUrl(path: string): string {
  // Ako je base64, vrati direktno
  if (path.startsWith('data:image')) {
    return path;
  }

  // Inače tretiraj kao relativnu putanju
  const backendUrl = 'https://backendis-mjco.onrender.com';
  return backendUrl + path;
}


}
