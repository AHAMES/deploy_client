import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { getBookReviews, deleteReview } from '../api/reviews-api'
import { getBookById } from '../api/book-api'
import { getAuthor } from '../api/author-api'
import Auth from '../auth/Auth'
import { UserReviewItem } from '../types/UserReviewItem'
import { BookItem } from '../types/BookItem'
import { AuthorItem } from '../types/AuthorItem'
import {} from '../api/author-api'
interface ReviewProps {
  match: {
    params: {
      bookId: string
    }
  }
  auth: Auth
  history: History
}

interface ReviewState {
  Reviews: UserReviewItem[]
  bookData: { BookName: string; AuthorName: string; genre: string }
  loadingReviews: boolean
  positiveReviews: number
  negativeReviews: number
}

export class Reviews extends React.PureComponent<ReviewProps, ReviewState> {
  state: ReviewState = {
    Reviews: [],
    bookData: { BookName: 'string', AuthorName: 'string', genre: 'string' },
    loadingReviews: true,
    positiveReviews: 0,
    negativeReviews: 0
  }
  onReviewDelete = async (review: UserReviewItem) => {
    try {
      await deleteReview(this.props.auth.getIdToken(), review.bookId)
      var array = [...this.state.Reviews]
      var index = array.indexOf(review)
      if (index !== -1) {
        array.splice(index, 1)
        this.setState({ Reviews: array })
      }
    } catch {
      alert('review deletion creation failed')
    }
  }

  getBookData = async (
    bookId: string
  ): Promise<{ BookName: string; genre: string; AuthorName: string }> => {
    try {
      const book = await getBookById(this.props.auth.getIdToken(), bookId)
      const author = await getAuthor(
        this.props.auth.getIdToken(),
        book.authorId
      )
      return { BookName: book.name, genre: book.genre, AuthorName: author.name }
    } catch {
      alert('Failed to remove review failed')
      return { BookName: '', genre: '', AuthorName: '' }
    }
  }
  async componentDidMount() {
    try {
      console.log(this.props.match.params.bookId)
      const Reviews = await getBookReviews(
        this.props.auth.getIdToken(),
        this.props.match.params.bookId
      )
      console.log(Reviews)

      const BookData = await this.getBookData(this.props.match.params.bookId)
      const positive = Reviews.filter(s => s.reviewRate >= 0).length
      const negative = Reviews.filter(s => s.reviewRate < 0).length
      this.setState({
        Reviews: Reviews,
        loadingReviews: false,
        bookData: BookData,
        positiveReviews: positive,
        negativeReviews: negative
      })
    } catch (e) {
      alert(`Failed to fetch Books: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">
          Reviews for {this.state.bookData.BookName} by{' '}
          {this.state.bookData.AuthorName}
        </Header>
        <Grid.Row>
          <Button icon color="green">
            <Icon name="thumbs up outline" />
          </Button>{' '}
          {this.state.positiveReviews}
          <Button icon color="red">
            <Icon name="thumbs down outline" />
          </Button>
          {this.state.negativeReviews}
        </Grid.Row>
        {this.renderReviews()}
      </div>
    )
  }

  renderReviews() {
    return this.renderReviewsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Books
        </Loader>
      </Grid.Row>
    )
  }
  renderReview(reviewRate: number) {
    if (reviewRate >= 0) {
      return (
        <Button icon color="green">
          <Icon name="thumbs up outline" />
        </Button>
      )
    } else if (reviewRate < 0) {
      return (
        <Button icon color="red">
          <Icon name="thumbs down outline" />
        </Button>
      )
    }
  }
  renderReviewsList() {
    return (
      <Grid padded>
        {console.log(this.state.Reviews)}
        {this.state.Reviews.map((review, pos) => {
          console.log(review)
          return (
            <Grid.Row key={review.createdAt}>
              <Grid.Column width={1} verticalAlign="middle">
                {this.renderReview(review.reviewRate)}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {}
              </Grid.Column>

              <Grid.Column width={2} verticalAlign="middle">
                {}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {/*<Button
                  icon
                  color="red"
                  onClick={() => this.onReviewDelete(review)}
                >
                  {<Icon name="delete" />}
                </Button>*/}
              </Grid.Column>

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
