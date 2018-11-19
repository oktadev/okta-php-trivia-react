import React, { Component } from 'react';
import { Button, Form, Message } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class PlayerForm extends Component {

    constructor (props) {
        super(props);
        this.state = {
            name: '',
            errorMessage: '',
            error: false,
            isLoading: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            name: e.target.value
        })
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            isLoading: true,
            error: false,
            errorMessage: ''
        });

        const accessToken = await this.props.auth.getAccessToken();
        const response = await fetch(API_BASE_URL + '/players', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            },
            body: JSON.stringify({
                "name": this.state.name
            })
        });
        const player = await response.json();

        if (player.errors) {
            this.setState({
                isLoading: false,
                error: true,
                errorMessage: player.errors
            });
        } else {
            this.setState({
                name: '',
                isLoading: false,
                error: false,
                errorMessage: ''
            });
            this.props.onAddition(player.data);
        }
    }

    render() {
        return (
            <Form error={this.state.error} onSubmit={this.onSubmit}>
                <Form.Field error={this.state.error}>
                    <label>Player Name:</label>
                    <input placeholder='enter player name' value={this.state.name} onChange={this.handleChange}/>
                { this.state.error &&
                <Message
                    error
                    header='Error creating player'
                    content={this.state.errorMessage}
                />
                }
                </Form.Field>
                <Button type='submit' loading={this.state.isLoading}>Add Player</Button>
            </Form>
        )
    }
});
