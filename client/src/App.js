import React from 'react';
import logo from './logo.svg';
import styled from "styled-components";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import Counter from './Counter';
//import Logout from './Logout';
import './App.css';

const defaultUser = {
    username: "",
    first_name: "",
    last_name: "",
    primary_email: "",
    city: ""
};

const GridBase = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "hd"
    "main"
    "ft";

  @media (min-width: 500px) {
    grid-template-columns: 40px 50px 1fr 50px 40px;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "hd hd hd hd hd"
      "sb sb main main main"
      "ft ft ft ft ft";
  }
`;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultUser;
        this.loggedIn = this.loggedIn.bind(this);
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    loggedIn() {
        return this.state.username && this.state.primary_email;
    }

    logIn(username) {
        fetch(`/users/${username}`)
            .then(res => res.json())
            .then(user => {
                this.setState(user)
            })
            .catch(() => {
                alert("An unexpected error occurred.");
                this.logOut();
            });
    }

    logOut() {
        fetch("/users/login", {
            method: "DELETE",
            credentials: "include"
        }).then(() => {
            this.setState(defaultUser);
        });
    }

    render() {
        return (
            <BrowserRouter>
                <GridBase>
                    <Route
                        exact path="/"
                        render={props => (
                            <Redirect to={`/login`}/>
                        )}
                    />
                    <Route
                        path="/login"
                        render={props =>
                            this.loggedIn() ? (
                                <Redirect to={`/profile/${this.state.username}`} />
                            ) : (
                                <Login {...props} logIn={this.logIn} />
                            )
                        }
                    />
                    <Route
                        path="/register"
                        render={props => {
                            return this.loggedIn() ? (
                                <Redirect to={`/profile/${this.state.username}`} />
                            ) : (
                                <Register {...props} />
                            );
                        }}
                    />
                    <Route
                        path="/profile/:username"
                        render={props => (
                            <Profile {...props} currentUser={this.state.username} />
                        )}
                   />
                   <Route
                       path="/counter"
                       render={props => (
                           <Counter {...props} />
                       )}
                   />

                </GridBase>
            </BrowserRouter>
        );
    }
}

export default App;

function Landing() {
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
  )
}

/*<Route
    path="/logout"
    render={props => <Logout {...props} logOut={this.logOut} />}
/>*/

