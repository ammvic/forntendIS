import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EditAnimal } from '@app/models/edit-animal';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AnimalService } from '@app/services/animal.service';
import { switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import citiesJson from '@app/models/cities.json';
import { AccommodationDto } from '@app/models/accommodation.model';

@Component({
  selector: 'app-animal-view',
  templateUrl: './animal-view.component.html',
  styleUrls: ['./animal-view.component.scss']
})
export class AnimalViewComponent implements OnInit {

  @Output() saveButtonClick = new EventEmitter<EditAnimal>();

  animal: EditAnimal = new EditAnimal();
  cities = JSON.parse(JSON.stringify(citiesJson));
  accommodations: AccommodationDto[] = []; // 🔹 nova promenljiva za listu smeštaja

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService
  ) {}

  ngOnInit(): void {
    this.loadAccommodations(); // 🔹 učitaj smeštaje

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        return this.animalService.getAnimal(id);
      })
    ).subscribe(animal => {
      this.animal = animal;
      console.log(this.animal);
    });
  }

  // 🔹 metoda za učitavanje smeštaja
  loadAccommodations(): void {
    this.animalService.getAccommodations().subscribe(
      (res: AccommodationDto[]) => {
        this.accommodations = res;
      },
      error => {
        console.error('Ne mogu da učitam smeštaje', error);
      }
    );
  }

  onSaveButtonClick(): void {
    this.saveButtonClick.emit(this.animal);
  }

  onSubmit(newAnimalForm: NgForm) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        return this.animalService.putAnimal(id, this.animal);
      })
    ).subscribe(
      res => {
        console.log('Animal updated');
        console.log(this.animal);
        this.router.navigateByUrl('animal/list');
      },
      error => {
        console.error(error);
      }
    );
  }
}
