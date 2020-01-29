import * as React from 'react'
import { Form, Button, Divider, Grid, Input, Image } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {
  getUploadUrl,
  uploadFile,
  patchAuthor,
  getAuthor
} from '../api/author-api'
import { AuthorItem } from '../types/AuthorItem'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditAuthorProps {
  match: {
    params: {
      authorId: string
    }
  }
  auth: Auth
}

interface EditAuthorState {
  file: any
  authorName: string
  uploadState: UploadState
  author: AuthorItem
}

export class EditAuthor extends React.PureComponent<
  EditAuthorProps,
  EditAuthorState
> {
  state: EditAuthorState = {
    file: undefined,
    authorName: 'new name',
    uploadState: UploadState.NoUpload,
    author: {
      name: '',
      authorId: this.props.match.params.authorId,
      createdAt: ''
    }
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
      const author = await getAuthor(
        this.props.auth.getIdToken(),
        this.props.match.params.authorId
      )
      this.setState({
        author: author
      })
      console.log(author)
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
        this.props.match.params.authorId
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
    this.setState({ authorName: event.target.value })
  }
  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }
  patchAuthor = async () => {
    let nameA = this.state.author.name
    if (this.state.authorName != '') {
      nameA = this.state.authorName
    }
    console.log('Patch is working')
    await patchAuthor(
      this.props.auth.getIdToken(),
      this.props.match.params.authorId,
      { name: nameA }
    )
  }
  renderUpdateAuthorInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Change Author Name',
              onClick: this.patchAuthor
            }}
            fluid
            defaultValue={this.state.author.name}
            actionPosition="left"
            placeholder={this.state.author.name}
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
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
