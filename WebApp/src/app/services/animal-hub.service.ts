import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { from, Observable, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Animal } from '@app/models/animal';

@Injectable({
  providedIn: 'root'
})
export class AnimalHubService {

  private connection: HubConnection;

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.animalHubUrl)
      .build();
  }

  private newConnectionObservable(): Observable<any> {
    return from(this.connection.start());
  }

  startConnection() {
    this.connection.start();
  }

  receiveAnimals(): Observable<Animal> {
    const animalSubject = new Subject<Animal>();
    // subscribe to 'ReceiveCreatedAnimal' method's messages
    this.connection.on('ReceiveCreatedAnimal', (animal: Animal) => {
      animalSubject.next(animal);
    });
    return this.newConnectionObservable()
      .pipe(concatMap(() => animalSubject.asObservable())
      );
  }

  sendAnimal(animal: Animal): void {
    this.connection.invoke('SendCreatedAnimal', animal);
  }

  disconnect(): void {
    if (this.connection != null) {
      this.connection.stop();
    }
  }
}
