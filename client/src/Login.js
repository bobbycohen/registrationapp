import React from 'react';
import PropTypes from "prop-types";
import {
    ErrorMessage,
    FormBase,
    FormLabel,
    FormInput,
    FormButton
} from "./shared";

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
                    <FormButton onClick={this.onSubmit}>Register</FormButton>
                </FormBase>
            </div>
        );
    }
}

Login.propTypes = {
    history: PropTypes.object.isRequired,
    logIn: PropTypes.func.isRequired
};

export default Login;