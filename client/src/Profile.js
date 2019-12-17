import React from 'react';
import PropTypes from "prop-types";
import styled from "styled-components";
import {
    ErrorMessage,
    InfoBlock,
    InfoData,
    InfoLabels,
    ShortP
} from "./shared";

const ProfileBlockBase = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: "pic" "profile";
  padding: 1em;

  @media (min-width: 500px) {
    grid-template-columns: auto 1fr;
    grid-template-areas: "pic profile";
    padding: 2em;
  }
`;

const ProfileBlock = props => {
    return (
        <ProfileBlockBase>
            <InfoBlock>
                <InfoLabels>
                    <p>Username:</p>
                    <p>First Name:</p>
                    <p>Last Name:</p>
                    <p>City:</p>
                    <p>Email Address:</p>
                </InfoLabels>
                <InfoData>
                    <ShortP>{props.username}</ShortP>
                    <ShortP>{props.first_name}</ShortP>
                    <ShortP>{props.last_name}</ShortP>
                    <ShortP>{props.city}</ShortP>
                    <ShortP>{props.primary_email}</ShortP>
                </InfoData>
            </InfoBlock>
        </ProfileBlockBase>
    )
};

const ProfileBase = styled.div`
    grid-area: main;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            first_name: "",
            last_name: "",
            primary_email: "",
            city: "",
            error: ""
        };
    }

    fetchUser(username) {
        this.setState({ error: null });
        fetch(`/users/${username}`)
            .then(res => res.json())
            .then(data => {
                this.setState(data);
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.fetchUser(this.props.match.params.username);
    }

    componentWillReceiveProps(nextProps) {
        const username = nextProps.match.params.username;
        if (username !== this.props.currentUser || username !== this.state.username)
            this.fetchUser(username);
    }

    render() {
        return (
            <div>
                <ProfileBase>
                    <ErrorMessage msg={this.state.error} hide={true} />
                    <ProfileBlock {...this.state} />
                </ProfileBase>
            </div>
        );
    }
}

Profile.propTypes = {
    match: PropTypes.object.isRequired,
    //history: PropTypes.func.isRequired,
    gridPlacement: PropTypes.string,
    user: PropTypes.string
};

export default Profile;