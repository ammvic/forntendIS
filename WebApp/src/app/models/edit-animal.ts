import {Fur} from '@app/models/fur';

export class EditAnimal {
  specialID: string;
  admissionDate: Date;
  microchipIntegrationDate: Date;
  vaccinationDate: Date;
  admissionCity: string;
  admissionRegion: string;
  animalType: number;
  gender: number;
  years: number;
  months: number;
  furType: number;
  furColor: string;
  specialTags: string;
  healthCondition: string;
  admissionOrganisationContacts: string;
  statusID: number;
  statusDate: Date;
  animalAgeCounter: string;
  animalTimeInShelterCounter: string;
  cageNumber?: string; // 🔹 dodato
  accommodationId?: number; // 🔹 dodato
}
