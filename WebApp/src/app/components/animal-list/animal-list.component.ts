import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Animal} from '@app/models/animal';
import {UserService} from '@app/services/user.service';
import {AnimalService} from '@app/services/animal.service';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {Status} from '@app/models/status';
import {Subscription} from 'rxjs';
import {AnimalHubService} from '@app/services/animal-hub.service';
import {Router} from '@angular/router';
import {AnimalType} from '@app/models/animalType';
import {MatSnackBar} from '@angular/material/snack-bar';
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-animal-list',
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.scss']
})
export class AnimalListComponent implements OnInit {
  displayedColumns: string[] = ['specialID', 'admissionDate', 'vaccinationDate', 'status', 'statusDate', 'icons'];
  public StatusEnum = Status;
  public AnimalTypeEnum = AnimalType;

  constructor(private animalService: AnimalService,
              private animalHub: AnimalHubService,
              private snackBar: MatSnackBar,
              private userService: UserService,
              private router: Router) { }

  animal = new Animal();
  animals: Animal[];
  err: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('animalTable') animalTable: MatTable<Animal>;
  dataSource: MatTableDataSource<Animal>;
  private subscription = new Subscription();

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  get fromDate() { return this.filterForm.get('fromDate').value; }
  get toDate() { return this.filterForm.get('toDate').value; }

  ngOnInit(): void {
    if (!this.userService.isLoggedIn())
    {
      this.router.navigate(['/login']);
    }

    this.animalService.getAnimals().subscribe(animals => {
      this.animals = animals;
      this.dataSource = new MatTableDataSource(this.animals);
      console.log(animals);
    }, error => this.err = error);

    const animalHubSubscription = this.animalHub.receiveAnimals().subscribe(
      animal => {
        this.animals.push(animal);
        this.animalTable.renderRows(); // refresh table
        this.snackBar.open(`Dodaj novu životinju "${animal.specialID}"!`, 'Info', {duration: 3000});
      },
      error => {
        console.error(error);
        this.snackBar.open(`${error.message}`, 'Error', {duration: 5000});
      }
    );

    this.subscription.add(animalHubSubscription);
    // this.dataSource.filterPredicate = (data: Animal, filter: string) => this.filterPeriod(data, filter);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.animalHub.disconnect();
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

  filterAnimals(): void {
    if (this.fromDate && this.toDate) {
      this.animalService.getFilteredAnimals(this.fromDate, this.toDate).subscribe(animals => {
        this.animals = animals;
        this.dataSource.data = this.animals;
        console.log(animals);
      }, error => this.err = error);
    }
  }

  resetAnimalList(): void {
    this.filterForm.reset();
    this.animalService.getAnimals().subscribe(animals => {
      this.animals = animals;
      this.dataSource.data = this.animals;
      console.log(animals);
    }, error => this.err = error);
  }

  navigateToEdit(animal): void {
    this.router.navigate(['animal/' + animal.id]);
  }

  generateAct(id: number){
    this.animalService.getAnimalAct(id).subscribe((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        saveAs(blob, 'zapisnikOprijemu.docx');
      },
      error => console.log(error)
    );
  }

  deleteAnimal(id: number){
    this.animalService.deleteAnimal(id).subscribe(
      (data) => {
        console.log('deleted');
        this.resetAnimalList();
      },
      error => console.log(error)
    );
  }

  needVaccine(animal): boolean{
    if (animal.vaccinationDate !== null) {
      const dt2 = new Date();
      const dt1 = new Date(animal.vaccinationDate.toString());
      const diffInTime = dt2.getTime() - dt1.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      return diffInDays >= 30;
    } else {
      return false;
    }
  }
}
