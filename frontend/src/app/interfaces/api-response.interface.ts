export interface IApiResponse<T> {
  result: boolean;
  data: T;
  message?: string;
}
