import { UserReviewItem } from './UserReviewItem'
export interface UserReviewItemDisplay {
  reviewData: UserReviewItem
  bookData: { BookName: string; AuthorName: string; genre: string }
}
