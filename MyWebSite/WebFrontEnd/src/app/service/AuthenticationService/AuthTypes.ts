export interface IAuthEndpoints {
  login: string,
  signup: string,
  refresh: string,
  logout: string
}


export interface ErrorObject {
  [key: string]: string[]; // Allow any string key with an associated array of strings
}

//interface IErrorTitle {
//  errorMessages: IErrorMessage[];
//}

//interface IErrorMessage {
//  errorMessage: string;
//}
