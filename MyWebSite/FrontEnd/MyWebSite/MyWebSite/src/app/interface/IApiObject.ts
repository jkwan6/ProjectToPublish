export interface IApiObject<T> {
  result: NestedResults<T>
}
export interface NestedResults<T> {
  objects: T,
  count: number
}
