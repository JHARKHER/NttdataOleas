
export interface JavaFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface JavaProject {
  name: string;
  description: string;
  files: JavaFile[];
}

export interface Customer {
  id: string;
  name: string;
  gender: string;
  identification: string;
  address: string;
  phone: string;
  state: boolean;
}

export interface Account {
  id: string;
  number: string;
  type: 'Ahorro' | 'Corriente';
  initialBalance: number;
  state: boolean;
  customerId: string;
}

export interface Movement {
  id: string;
  accountId: string;
  date: string;
  type: 'Deposito' | 'Retiro';
  value: number;
  balance: number;
}
