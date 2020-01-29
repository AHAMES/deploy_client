import { apiEndpoint } from '../config'
import { UserReviewItem } from '../types/UserReviewItem'
import { UserReviewItemDisplay } from '../types/UserReviewItemDisplay'
import { CreateUserReviewRequest } from '../types/CreateUserReviewRequest'
import Axios from 'axios'

export async function getBookReviews(
  idToken: string,
  bookId: string
): Promise<UserReviewItem[]> {
  console.log('Fetching Books by Author')

  const response = await Axios.get(`${apiEndpoint}/userReview/all/${bookId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Reviews:', response.data)
  return response.data.item
}

export async function getUserReviews(
  idToken: string
): Promise<UserReviewItemDisplay[]> {
  console.log('Fetching Reviews')

  const response = await Axios.get(`${apiEndpoint}/userReview/all`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Reviews:', response.data)
  return response.data.item
}

export async function getReview(
  idToken: string,
  bookId: string
): Promise<UserReviewItem> {
  console.log('Fetching Review')

  const response = await Axios.get(`${apiEndpoint}/userReview/${bookId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Review:', response.data)
  return response.data.items
}

export async function createReview(
  idToken: string,
  newReview: CreateUserReviewRequest
): Promise<UserReviewItem> {
  const response = await Axios.post(
    `${apiEndpoint}/userReview`,
    JSON.stringify(newReview),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}
export async function deleteReview(idToken: string, bookId: string) {
  const response = await Axios.delete(`${apiEndpoint}/userReview/${bookId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function patchReview(
  idToken: string,
  bookId: string,
  reviewRate: number
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/userReview/${bookId}`,
    JSON.stringify(reviewRate),
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
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
