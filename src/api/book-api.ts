import { apiEndpoint } from '../config'
import { BookItem } from '../types/BookItem'
import { CreateBookRequest } from '../types/CreateBookRequest'
import Axios from 'axios'
import { UpdateBookRequest } from '../types/UpdateBookRequest'

export async function getAuthorBooks(
  idToken: string,
  AuthorId: string
): Promise<BookItem[]> {
  console.log('Fetching Books by Author')

  const response = await Axios.get(`${apiEndpoint}/books/author/${AuthorId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Books:', response.data)
  return response.data.items
}

export async function getBookById(
  idToken: string,
  bookId: string
): Promise<BookItem> {
  console.log('Fetching Book')

  const response = await Axios.get(`${apiEndpoint}/books/${bookId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Books:', response.data)
  return response.data.items
}

export async function getAllBooks(idToken: string): Promise<BookItem[]> {
  console.log('Fetching Book')

  const response = await Axios.get(`${apiEndpoint}/books`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Books:', response.data)
  return response.data.items
}

export async function createBook(
  idToken: string,
  newBook: CreateBookRequest
): Promise<BookItem> {
  const response = await Axios.post(
    `${apiEndpoint}/books`,
    JSON.stringify(newBook),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchBook(
  idToken: string,
  bookId: string,
  updatedBook: UpdateBookRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/books/${bookId}`,
    JSON.stringify(updatedBook),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function getUploadUrl(
  idToken: string,
  bookId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/commons/${bookId}/attachment`,
    JSON.stringify({ bucketName: 'book' }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  console.log(JSON.stringify({ bucketName: 'book' }))
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
