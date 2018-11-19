import React, { Component } from 'react';
import { Header, Message, Table } from 'semantic-ui-react';
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class Trivia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: null,
            isLoading: null
        };
    }

    componentDidMount() {
        this.getPlayers();
    }

    async getPlayers() {
        if (! this.state.players) {
            try {
                this.setState({ isLoading: true });
                const accessToken = await this.props.auth.getAccessToken();
                const response = await fetch(API_BASE_URL + '/players', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const playersList = await response.json();
                this.setState({ players: playersList.data, isLoading: false});
            } catch (err) {
                this.setState({ isLoading: false });
                console.error(err);
            }
        }
    }

    render() {
        return (
            <div>
                <Header as="h1">Players</Header>
                {this.state.isLoading && <Message info header="Loading players..." />}
                {this.state.players &&
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Answers</th>
                                    <th>Points</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.players.map(
                                    player =>
                                        <tr id={player.id} key={player.id}>
                                            <td>{player.id}</td>
                                            <td>{player.name}</td>
                                            <td>{player.answers}</td>
                                            <td>{player.points}</td>
                                            <td>
                                                Action buttons placeholder
                                            </td>
                                        </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                }
            </div>
        );
    }

});
