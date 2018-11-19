import React, { Component } from 'react';
import { Header, Message, Table, Card, Button } from 'semantic-ui-react';
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL, TRIVIA_ENDPOINT } from './config'

import PlayerForm from './PlayerForm';
import DeletePlayerButton from './DeletePlayerButton';
import RightAnswerButton from './RightAnswerButton';
import WrongAnswerButton from './WrongAnswerButton';

export default withAuth(class Trivia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: null,
            isLoading: null,
            question: null,
            isQuestionLoading: null
        };
        this.onAddition = this.onAddition.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.getQuestion = this.getQuestion.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
    }

    componentDidMount() {
        this.getPlayers()
        this.getQuestion()
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

    async getQuestion() {
        try {
            this.setState({ isQuestionLoading: true });
            const response = await fetch(TRIVIA_ENDPOINT);
            const questions = await response.json();
            this.setState({ question: questions[0], isQuestionLoading: false });
        } catch (err) {
            this.setState({ isQuestionLoading: false });
            console.error(err);
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

    onAnswer(id, data) {
        let players = this.state.players
        let player = players.findIndex(player => player.id === id)
        players[player] = data
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
                                                <RightAnswerButton onRightAnswer={this.onAnswer} playerId={player.id} />
                                                <WrongAnswerButton onWrongAnswer={this.onAnswer} playerId={player.id} />
                                                <DeletePlayerButton onDelete={this.onDelete} playerId={player.id} />
                                            </td>
                                        </tr>
                            )}
                            </tbody>
                        </Table>
                        <PlayerForm onAddition={this.onAddition} />
                    </div>
                }
                <Header as="h2">Current Question</Header>
                {this.state.isQuestionLoading && <Message info header="Loading question..." />}
                {this.state.question &&
                    <div>
                        <Card>
                            <Card.Content>
                              <Card.Header>{this.state.question.question}</Card.Header>
                              <Card.Description> Correct answer: {this.state.question.answer}</Card.Description>
                            </Card.Content>
                        </Card>
                        <Button type='button' onClick={this.getQuestion}>Refresh Question</Button>
                    </div>
                }
            </div>
        );
    }

});
