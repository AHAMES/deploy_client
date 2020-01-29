/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateBookRequest {
  name: string
  authorId: string
  releaseDate: string
  genre: string
}
