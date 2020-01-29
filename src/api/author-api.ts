import { apiEndpoint } from '../config'
import { AuthorItem } from '../types/AuthorItem'
import { CreateAuthorRequest } from '../types/CreateAuthorRequest'
import Axios from 'axios'
import { UpdateAuthorRequest } from '../types/UpdateAuthorRequest'

export async function getAuthors(idToken: string): Promise<AuthorItem[]> {
  console.log('Fetching Authors')

  const response = await Axios.get(`${apiEndpoint}/authors`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Authros:', response.data)
  return response.data.items
}

export async function getAuthor(
  idToken: string,
  AuthorId: string
): Promise<AuthorItem> {
  console.log('Fetching Authors')

  const response = await Axios.get(`${apiEndpoint}/authors/${AuthorId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Authros:', response.data)
  return response.data.items
}

export async function createAuthor(
  idToken: string,
  newAuthor: CreateAuthorRequest
): Promise<AuthorItem> {
  const response = await Axios.post(
    `${apiEndpoint}/authors`,
    JSON.stringify(newAuthor),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchAuthor(
  idToken: string,
  AuthorId: string,
  updatedAuthor: UpdateAuthorRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/authors/${AuthorId}`,
    JSON.stringify(updatedAuthor),
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
  AuthorId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/commons/${AuthorId}/attachment`,
    JSON.stringify({ bucketName: 'author' }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  console.log(JSON.stringify({ bucketName: 'author' }))
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
