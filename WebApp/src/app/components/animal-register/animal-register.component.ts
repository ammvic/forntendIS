import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Animal} from '../../models/animal';
import {User} from '@app/models/user';
import {UserService} from '@app/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AnimalService} from '@app/services/animal.service';
import {NewAnimal} from '@app/models/new-animal';
import {Fur} from '@app/models/fur';
import {AnimalHubService} from '@app/services/animal-hub.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import citiesJson from '@app/models/cities.json' ;
import {FurType} from '@app/models/furType';
import {AnimalType} from '@app/models/animalType';
import { AccommodationDto } from '../../models/accommodation.model';



@Component({
  selector: 'app-animal-register',
  templateUrl: './animal-register.component.html',
  styleUrls: ['./animal-register.component.scss']
})


export class AnimalRegisterComponent implements OnInit {

  public FurTypeEnum = FurType;
  public AnimalTypeEnum = AnimalType;

  @Output()
  addButtonClick = new EventEmitter<NewAnimal>();
  animal: NewAnimal = new NewAnimal();
  selectedValue: string;
  cities = JSON.parse(JSON.stringify(citiesJson));
   accommodations: AccommodationDto[] = [];


  constructor(private animalService: AnimalService,
              private animalHub: AnimalHubService,
              private snackBar: MatSnackBar,
              private userService: UserService,
              private router: Router) {
  }

  previewImage: string | ArrayBuffer | null = null;

onFileSelected(event: any): void {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    this.previewImage = reader.result;
    this.animal.imageUrl = reader.result as string; // <<< OVO JE BITNO
  };

  reader.readAsDataURL(file);
}


  ngOnInit(): void {

    this.animalHub.startConnection();
    this.loadAccommodations();
  }

  ngOnDestroy(): void {
    this.animalHub.disconnect();


    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

 onAddButtonClick(): void {
  this.addButtonClick.emit(this.animal);
  console.log(this.animal);

  this.animalService.addAnimal(this.animal)
    .subscribe(savedAnimal => {
        console.log(savedAnimal);
        this.animalHub.sendAnimal(savedAnimal);
        this.snackBar.open('Zivotinja je uspesno registrovana', '', {duration: 5000});

        // 🔥 RESET SLIKE I MODELA
        this.previewImage = null;
        this.animal.imageUrl = '';
        this.animal = new NewAnimal();

        this.addButtonClick.emit();
      },
      error => {
        this.snackBar.open(`${error.message}`, 'Error', {duration: 5000});
        console.log(error);
      });
}


  onSubmit(form: NgForm) {
    form.resetForm();

  }




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

}
