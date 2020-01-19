import React from 'react'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';

class Channels extends React.Component {
  state = {
    channels: [],
    channelName: '',
    channelDetails: "",
    channelsRef: firebase.firestore().collection('channels'),
    userRef: firebase.firestore().doc(`users/${this.props.currentUser.uid}`),
    modal: false
  }

  addChannel = async () => {
    const { channelsRef, channelName, channelDetails, userRef } = this.state;

    // Get the key from the channels ref doc
    const key = channelsRef.doc().id;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: userRef
    }

    channelsRef.doc(key)
      .set(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" })
        this.closeModal();
        console.log('channel added')
        await newChannel.createdBy.get()
      })
      .catch(err => console.error(err));
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault();
    if(this.isFormValid(this.state)){
      this.addChannel();
    }
  }

  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });

  render() {
    const { channels, modal } = this.state;
    return(
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name="exchange"/> CHANNELS
          </span>{" "}
          ({ channels.length }) <Icon name="add" onClick={this.openModal}/>
        </Menu.Item>
        {/* Show all channels */}
        </Menu.Menu>
        {/* // Add Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.onSubmit}>
              <Form.Field>
                <Input 
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />              
              </Form.Field>
              <Form.Field>
                <Input 
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleSubmit} color="green" inverted>
              <Icon name="checkmark"/> Add 
            </Button>
            <Button onClick={this.closeModal} color="red" inverted>
              <Icon name="remove"/> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}
export default Channels;