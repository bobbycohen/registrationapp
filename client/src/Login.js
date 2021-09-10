import React from 'react';
import PropTypes from "prop-types";
import {
    ErrorMessage,
    FormBase,
    FormLabel,
    FormInput,
    FormButton
} from "./shared";
import FacebookLoginBtn from 'react-facebook-login';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: ""
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(ev) {
        if (ev.target.name === "username")
            ev.target.value = ev.target.value.toLowerCase();
        this.setState({ [ev.target.name]: ev.target.value });
    }

    onSubmit(ev) {
        ev.preventDefault();
        if (!this.state.hasOwnProperty("error") || this.state.error !== "") return;
        fetch("/users/session", {
            method: "POST",
            body: JSON.stringify(this.state),
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        })
            .then(res => {
                res.json().then(data => {
                    if (res.ok) {
                        this.props.logIn(data.username);
                    } else {
                        this.setState( { error: `Error: ${data.error}` });
                    }
                });
            });
    }

    componentDidMount() {
        document.getElementById("username").focus();
    }

    render() {
        return (
            <div style={{ gridArea: "main" }}>
                <ErrorMessage msg={this.state.error} />
                <FormBase>
                    <FormLabel htmlFor="username">Username:</FormLabel>
                    <FormInput
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={this.onChange}
                        value={this.state.username}
                    />
                    <FormLabel htmlFor="password">Password:</FormLabel>
                    <FormInput
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={this.onChange}
                        value={this.state.password}
                    />
                    <div />
                    <FormButton onClick={this.onSubmit}>Login</FormButton>
                    <div />
                    <FormButton onClick={() => this.props.history.push("/register")}>Register</FormButton>
                    <div />
                    <FormButton onClick={() => this.props.history.push("/counter")}>Counter</FormButton>
                </FormBase>
            </div>
        );
    }
}

class LoginFacebook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            name: "",
            picture: ""
        }
    };

    componentClicked = () => {
        console.log('Facebook button clicked');
    };

    responseFacebook = (response) => {
        console.log(response);
        this.setState({
            auth: true,
            name: response.name,
            picture: response.picture.data.url
        });
    };

    render() {
        let facebookData;

        this.state.auth ?
            facebookData = (
                <div>
                    <img src={this.state.picture} alt={this.state.name} />
                    <h2>Welcome, {this.state.name}!</h2>
                </div>
            ) :
            facebookData = (
                <FacebookLoginBtn
                    appId="483040995642323"
                    autoLoad={true}
                    fields="name,picture"
                    onClick={this.componentClicked}
                    callback={this.responseFacebook}
                />
            );

        return (
            <>
                {facebookData}
            </>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object.isRequired,
    logIn: PropTypes.func.isRequired
};

export default Login;