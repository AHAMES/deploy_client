/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateBookRequest {
  name: string
  authorId: string
  releaseDate: string
  genre: string
}
