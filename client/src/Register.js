import React from 'react';
import PropTypes from "prop-types";
import {
    ErrorMessage,
    FormBase,
    FormInput,
    FormLabel,
    FormButton,
    ModalNotify
} from "./shared";

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            first_name: "",
            last_name: "",
            city: "",
            primary_email: "",
            password: "",
            error: ""
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onAcceptRegister = this.onAcceptRegister.bind(this);

    }

    onChange(ev) {
        this.setState({ [ev.target.name]: ev.target.value, error: "" });
        if (ev.target.name === "username") {
            let usernameInvalid = validUsername(ev.target.value);
            if (usernameInvalid)
                this.setState({ error: `Error: ${usernameInvalid.error}` });
        }
        if (ev.target.name === "password") {
            let pwdInvalid = validPassword(ev.target.value);
            if (pwdInvalid)
                this.setState({ error: `Error: ${pwdInvalid.error}` });
        }
    }

    onSubmit(ev) {
        ev.preventDefault();
        if (!this.state.hasOwnProperty("error") || this.state.error !== "") return;
        fetch("/users", {
            method: "POST",
            body: JSON.stringify(this.state),
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        })
            .then(res => {
                if (res.ok) {
                    this.setState({
                        notify: `${this.state.username} successfully registered. You will now need to log in.`
                    });
                } else res.json().then(error => this.setState(error));
            })
            .catch(err => console.log(err));
    }

    onAcceptRegister() {
        this.props.history.push("/login");
    }

    componentDidMount() {
        document.getElementById("username").focus();
    }

    render() {
        return (
            <div style={{ gridArea: "main" }}>
                {this.state.notify ? (
                    <ModalNotify
                        msg={this.state.notify}
                        onAccept={this.onAcceptRegister}
                    />
                ) : null}
                <ErrorMessage msg={this.state.error} />
                <FormBase>
                    <FormLabel htmlFor="username">Username:</FormLabel>
                    <FormInput
                        id="username"
                        name="username"
                        placeholder="Username"
                        onChange={this.onChange}
                        value={this.state.username}
                    />
                    <FormLabel htmlFor="first_name">First Name:</FormLabel>
                    <FormInput
                        id="first_name"
                        name="first_name"
                        placeholder="First Name"
                        onChange={this.onChange}
                        value={this.state.first_name}
                    />
                    <FormLabel htmlFor="last_name">Last Name:</FormLabel>
                    <FormInput
                        id="last_name"
                        name="last_name"
                        placeholder="Last Name"
                        onChange={this.onChange}
                        value={this.state.last_name}
                    />
                    <FormLabel htmlFor="primary_email">Email:</FormLabel>
                    <FormInput
                        id="primary_email"
                        name="primary_email"
                        placeholder="Email"
                        onChange={this.onChange}
                        value={this.state.primary_email}
                    />
                    <FormLabel htmlFor="city">City:</FormLabel>
                    <FormInput
                        id="city"
                        name="city"
                        placeholder="City"
                        onChange={this.onChange}
                        value={this.state.city}
                    />
                    <FormLabel htmlFor="password">Password:</FormLabel>
                    <FormInput
                        id="password"
                        name="password"
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

const validUsername = username => {
    if (!username || username.length <= 2 || username.length >= 16) {
        return { error: "Username length must be > 2 and < 16" };
    } else if (!username.match(/^[a-z0-9]+$/i)) {
        return { error: "Username must be alphanumeric" };
    }
    return undefined;
};

const validPassword = password => {
    if (!password || password.length < 8) {
        return { error: "Password length must be > 7" };
    } else if (!password.match(/[0-9]/i)) {
        return { error: "Password must contain at least one numeric character" };
    } else if (!password.match(/[a-z]/)) {
        return { error: "Password must contain at least one lowercase character" };
    } else if (!password.match(/[A-Z]/)) {
        return { error: "Password must contain at least one uppercase character" };
    }
    return undefined;
};

Register.propTypes = {
    history: PropTypes.object.isRequired
};

export default Register;