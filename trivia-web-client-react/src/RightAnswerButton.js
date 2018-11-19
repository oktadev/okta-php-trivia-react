import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'

export default withAuth(class RightAnswerButton extends Component {

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

        const accessToken = await this.props.auth.getAccessToken();
        const response = await fetch(API_BASE_URL + '/players/' + this.state.id + '/answers', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            },
            body: JSON.stringify({
                "correct": true
            })
        });

        const player = await response.json();
        await this.setState({
            isUpdating: false
        });
        this.props.onRightAnswer(this.state.id, player.data);
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Button type='submit' loading={this.state.isUpdating}>(+1) Right</Button>
            </Form>
        )
    }
});
