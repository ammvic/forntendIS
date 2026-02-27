export class NewAnimal {
  id?: number;
  specialID!: string;
  admissionDate!: Date;
  microchipIntegrationDate?: Date;
  vaccinationDate?: Date;
  birthday!: Date;
  admissionCity!: string;
  admissionRegion!: string;
  animalType!: number; // Enum u backendu
  gender!: number; // Enum u backendu
  furType!: number; // Enum u backendu
  furColor!: string;
  specialTags!: string;
  healthCondition!: string;
  admissionOrganisationContacts!: string;
  status?: number; // Enum u backendu
  statusDate?: Date;
  accommodationId?: number;
  cageNumber?: string;
  imageUrl: string;
}
