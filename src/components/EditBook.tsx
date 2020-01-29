import * as React from 'react'
import { Form, Button, Divider, Grid, Input, Image } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {
  getUploadUrl,
  uploadFile,
  patchBook,
  getBookById
} from '../api/book-api'
import { BookItem } from '../types/BookItem'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditAuthorProps {
  match: {
    params: {
      bookId: string
    }
  }
  auth: Auth
}

interface EditAuthorState {
  file: any
  uploadState: UploadState
  bookName: string
  genre: string
  releaseDate: string
  book: BookItem
}

export class EditBook extends React.PureComponent<
  EditAuthorProps,
  EditAuthorState
> {
  state: EditAuthorState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    book: {
      name: '',
      authorId: '',
      createdAt: '',
      genre: '',
      bookId: this.props.match.params.bookId,
      releaseDate: ''
    },
    bookName: '',
    releaseDate: '',
    genre: ''
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  async componentDidMount() {
    try {
      const book = await getBookById(
        this.props.auth.getIdToken(),
        this.props.match.params.bookId
      )
      this.setState({
        book: book
      })
      console.log(book)
    } catch (e) {
      alert(`Failed to fetch Books: ${e.message}`)
    }
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.bookId
      )

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ bookName: event.target.value })
  }

  handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ genre: event.target.value })
  }
  handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ releaseDate: event.target.value })
  }
  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }
  patchBook = async () => {
    let bookName = this.state.book.name
    if (this.state.bookName != '') {
      bookName = this.state.bookName
    }

    let genre = this.state.book.genre
    if (this.state.genre != '') {
      genre = this.state.genre
    }

    let releaseDate = this.state.book.releaseDate
    if (this.state.releaseDate != '') {
      releaseDate = this.state.releaseDate
    }

    const details = {
      name: bookName,
      genre: genre,
      releaseDate: releaseDate,
      authorId: this.state.book.authorId
    }
    console.log(details)
    console.log('Patch is working')
    await patchBook(
      this.props.auth.getIdToken(),
      this.props.match.params.bookId,
      details
    )
    alert('Item updated, empty items reverted back to default')
  }
  renderUpdateAuthorInput() {
    return (
      <div>
        <Grid.Row>
          <Grid.Column width={16}>
            <Input
              action={{
                color: 'teal',
                labelPosition: 'left',
                icon: 'add',
                content: 'Change Book Data',
                onClick: this.patchBook
              }}
              fluid
              actionPosition="left"
              defaultValue={this.state.book.name}
              placeholder={this.state.book.name}
              onChange={this.handleNameChange}
            />
          </Grid.Column>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <Input
              fluid
              actionPosition="left"
              defaultValue={this.state.book.genre}
              placeholder={this.state.book.genre}
              onChange={this.handleGenreChange}
            />
          </Grid.Column>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <Input
              fluid
              actionPosition="left"
              defaultValue={this.state.book.releaseDate}
              placeholder={this.state.book.releaseDate}
              onChange={this.handleDateChange}
            />
          </Grid.Column>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </Grid.Row>
      </div>
    )
  }
  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>

        <Divider />
        {this.renderUpdateAuthorInput()}
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p>Uploading file</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
