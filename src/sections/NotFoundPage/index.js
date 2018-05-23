import React from 'react';
import { Icon, Container, Message } from 'semantic-ui-react';

class NotFound extends React.Component {
  render() {
    return (
      <Container textAlign='center'>
            <h1><Icon name='broken chain' /><br /> Not Found!</h1>
            <Message warning compact>
                Sorry! The content you're looking for may have moved. Please try navigating again to it.
            </Message>
        </Container>
    );
  }
}
export default NotFound;
