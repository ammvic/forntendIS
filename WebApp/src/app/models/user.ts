export class User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  constructor(email: string, password:string, firstName: string, lastName: string) {
    this.email = email;
    this.password = password;
    this.firstName=firstName;
    this.lastName=lastName;
   
  }
}

export class Employee extends User {
  employeeID: number;
  firstName: string;
  lastName: string;
  role: string;
  employmentDate?: Date; // Opcionalna polja
  phone?: string;

  constructor(
    email: string,
    password: string,
    employeeID: number,
    firstName: string,
    lastName: string,
    role: string,
    employmentDate?: Date,
    phone?: string
  ) {
    super(email, password, firstName, lastName); // Poziva konstruktor iz klase `User`
    this.employeeID = employeeID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.employmentDate = employmentDate;
    this.phone = phone;
  }
}
