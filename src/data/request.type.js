// @flow

export type Page<T> = {
  content: T[],
  page: number,
  last: boolean,
}