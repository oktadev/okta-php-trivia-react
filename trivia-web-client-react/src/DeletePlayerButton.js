import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react'
import { withOktaAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withOktaAuth(class DeletePlayerButton extends Component {

    constructor (props) {
        super(props);
        this.state = {
            id: props.playerId,
            isUpdating: false
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            isUpdating: true
        });

        const accessToken = this.props.authState.accessToken;
        const response = await fetch(API_BASE_URL + '/players/' + this.state.id, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            }
        });

        await response;
        await this.setState({
            isUpdating: false
        });
        this.props.onDelete(this.state.id);
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Button type='submit' loading={this.state.isUpdating}>Delete Player</Button>
            </Form>
        )
    }
});
