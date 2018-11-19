import React, { Component } from 'react';
import { Header, Message, Table } from 'semantic-ui-react';
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

import PlayerForm from './PlayerForm';
import DeletePlayerButton from './DeletePlayerButton';

export default withAuth(class Trivia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: null,
            isLoading: null
        };
        this.onAddition = this.onAddition.bind(this);
        this.onDelete = this.onDelete.bind(this);
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

    onAddition(player) {
        this.setState({
            players: [...this.state.players, player]
        })
    }

    onDelete(id) {
        let players = this.state.players
        let index = players.findIndex(player => player.id === id)
        players.splice(index, 1)
        this.setState({
            players: players
        })
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
                                                <DeletePlayerButton onDelete={this.onDelete} playerId={player.id} />
                                            </td>
                                        </tr>
                            )}
                            </tbody>
                        </Table>
                        <PlayerForm onAddition={this.onAddition} />
                    </div>
                }
            </div>
        );
    }

});
