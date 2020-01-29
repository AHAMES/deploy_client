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

import { createBook, getAuthorBooks, patchBook } from '../api/book-api'
import { createReview } from '../api/reviews-api'
import Auth from '../auth/Auth'
import { BookItem } from '../types/BookItem'
import { CreateBookRequest } from '../types/CreateBookRequest'

interface BooksProps {
  match: {
    params: {
      AuthorId: string
    }
  }
  auth: Auth
  history: History
}

interface BooksState {
  authorId: string
  Books: BookItem[]
  newBookName: string
  loadingBooks: boolean
}

export class Book extends React.PureComponent<BooksProps, BooksState> {
  state: BooksState = {
    authorId: this.props.match.params.AuthorId,
    Books: [],
    newBookName: '',
    loadingBooks: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookName: event.target.value })
  }

  onEditButtonClick = (bookId: string) => {
    this.props.history.push(`/books/${bookId}/edit`)
  }

  onReviewssButtonClick = (bookId: string) => {
    this.props.history.push(`/books/${bookId}/reviews`)
  }

  onBookCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const bookDetails: CreateBookRequest = {
        name: this.state.newBookName,
        genre: 'Fantasy',
        releaseDate: new Date().getFullYear().toString(),
        authorId: this.props.match.params.AuthorId
      }
      console.log({
        bookDetails
      })

      const newBook = await createBook(
        this.props.auth.getIdToken(),
        bookDetails
      )
      console.log(newBook)
      this.setState({
        Books: [...this.state.Books, newBook],
        newBookName: ''
      })
    } catch {
      alert('Book creation failed')
    }
  }
  onBooksButtonClick = (bookId: string) => {
    this.props.history.push(`/reviews/${bookId}`)
  }

  onLikeClick = async (bookId: string) => {
    try {
      await createReview(this.props.auth.getIdToken(), {
        reviewRate: 5,
        bookId: bookId
      })
    } catch {
      alert('Failure to review')
    }
  }

  onDisLikeClick = async (bookId: string) => {
    try {
      await createReview(this.props.auth.getIdToken(), {
        reviewRate: -5,
        bookId: bookId
      })
    } catch {
      alert('Failure to review')
    }
  }

  async componentDidMount() {
    try {
      const Books = await getAuthorBooks(
        this.props.auth.getIdToken(),
        this.props.match.params.AuthorId
      )
      this.setState({
        Books,
        loadingBooks: false
      })
    } catch (e) {
      alert(`Failed to fetch Books: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Books by the author</Header>

        {this.renderCreateBookInput()}

        {this.renderBooks()}
      </div>
    )
  }

  renderCreateBookInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Book',
              onClick: this.onBookCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To kill a mocking bird..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderBooks() {
    return this.renderBooksList()
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

  renderBooksList() {
    return (
      <Grid padded>
        {this.state.Books.map((book, pos) => {
          return (
            <Grid.Row key={book.bookId}>
              <Grid.Column width={5} verticalAlign="middle">
                {book.name}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {book.genre}
              </Grid.Column>
              <Grid.Column width={2} verticalAlign="middle">
                {book.releaseDate}
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onDisLikeClick(book.bookId)}
                >
                  <Icon name="thumbs down outline" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                <Button
                  icon
                  color="green"
                  onClick={() => this.onLikeClick(book.bookId)}
                >
                  <Icon name="thumbs up outline" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle"></Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(book.bookId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="green"
                  onClick={() => this.onBooksButtonClick(book.bookId)}
                >
                  {<Icon name="book" />}
                </Button>
              </Grid.Column>
              {book.attachmentUrl && (
                <Image src={book.attachmentUrl} size="small" wrapped />
              )}
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
