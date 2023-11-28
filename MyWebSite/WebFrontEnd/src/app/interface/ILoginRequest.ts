export interface ILoginRequest {
  client_id: string;
  username: string;
  password: string;
  scope: string;
  grant_type: string;
}
