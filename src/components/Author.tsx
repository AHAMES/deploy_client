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

import { createAuthor, getAuthors, patchAuthor } from '../api/author-api'

import Auth from '../auth/Auth'
import { AuthorItem } from '../types/AuthorItem'

interface AuthorsProps {
  auth: Auth
  history: History
}

interface AuthorsState {
  Authors: AuthorItem[]
  newAuthorName: string
  loadingAuthors: boolean
}

export class Author extends React.PureComponent<AuthorsProps, AuthorsState> {
  state: AuthorsState = {
    Authors: [],
    newAuthorName: '',
    loadingAuthors: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAuthorName: event.target.value })
  }

  onEditButtonClick = (authorId: string) => {
    this.props.history.push(`/authors/${authorId}/edit`)
  }

  onBooksButtonClick = (AuthorId: string) => {
    this.props.history.push(`/authors/${AuthorId}/books`)
  }

  onAuthorCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newAuthor = await createAuthor(this.props.auth.getIdToken(), {
        name: this.state.newAuthorName
      })
      this.setState({
        Authors: [...this.state.Authors, newAuthor],
        newAuthorName: ''
      })
    } catch {
      alert('Author creation failed')
    }
  }

  onAuthorCheck = async (pos: number) => {
    try {
      const author = this.state.Authors[pos]
      await patchAuthor(this.props.auth.getIdToken(), author.authorId, {
        name: author.name
      })
      this.setState({
        Authors: update(this.state.Authors, {
          [pos]: { name: { $set: author.name } }
        })
      })
    } catch {
      alert('Author deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const Authors = await getAuthors(this.props.auth.getIdToken())
      this.setState({
        Authors,
        loadingAuthors: false
      })
    } catch (e) {
      alert(`Failed to fetch Authors: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Authors</Header>

        {this.renderCreateAuthorInput()}

        {this.renderAuthors()}
      </div>
    )
  }

  renderCreateAuthorInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Author',
              onClick: this.onAuthorCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderAuthors() {
    if (this.state.loadingAuthors) {
      return this.renderLoading()
    }

    return this.renderAuthorsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Authors
        </Loader>
      </Grid.Row>
    )
  }

  renderAuthorsList() {
    return (
      <Grid padded>
        {this.state.Authors.map((author, pos) => {
          return (
            <Grid.Row key={author.authorId}>
              <Grid.Column width={10} verticalAlign="middle">
                {author.name}
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                {/*<Checkbox
                  onChange={() => this.onAuthorCheck(pos)}
                  //checked={}
                />*/}
              </Grid.Column>
              <Grid.Column width={3} floated="right"></Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(author.authorId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="green"
                  onClick={() => this.onBooksButtonClick(author.authorId)}
                >
                  <Icon name="book" />
                </Button>
              </Grid.Column>
              {author.attachmentUrl && (
                <Image src={author.attachmentUrl} size="small" wrapped />
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
