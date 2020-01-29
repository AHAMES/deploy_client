import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditAuthor } from './components/EditAuthor'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Author } from './components/Author'
import { Book } from './components/AuthorsBook'
import { Reviews } from './components/Reviews'
import { Books } from './components/AllBooks'
import { MyReviews } from './components/UserReviews'
import { EditBook } from './components/EditBook'
export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Item name="authors">
          <Link to="/authors">Authors</Link>
        </Menu.Item>
        <Menu.Item name="books">
          <Link to="/books">Books</Link>
        </Menu.Item>

        <Menu.Item name="reviews">
          <Link to="/reviews">My Reviews</Link>
        </Menu.Item>
        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Author {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/authors"
          exact
          render={props => {
            return <Author {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/authors/:authorId/edit"
          exact
          render={props => {
            return <EditAuthor {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/authors/:AuthorId/books"
          exact
          render={props => {
            return <Book {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/books"
          exact
          render={props => {
            return <Books {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/books/:bookId/edit"
          exact
          render={props => {
            return <EditBook {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/reviews/:bookId"
          exact
          render={props => {
            return <Reviews {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/reviews"
          exact
          render={props => {
            return <MyReviews {...props} auth={this.props.auth} />
          }}
        />
        <Route component={NotFound} />
      </Switch>
    )
  }
}
