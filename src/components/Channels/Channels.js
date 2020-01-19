import React from 'react'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions';

class Channels extends React.Component {
  state = {
    channels: [],
    channelName: '',
    channelDetails: "",
    channelsRef: firebase.firestore().collection('channels'),
    userRef: firebase.firestore().doc(`users/${this.props.currentUser.uid}`),
    modal: false,
    firstLoad: true,
    activeChannel: '',
  }
  componentDidMount(){
    this.addListeners();
  }
  componentWillUnmount() {
    this.removeListeners();
  }
  removeListeners = () => {
    this.state.channelsRef.unsub();
  }
  addListeners = async () => {
    let observer = this.state.channelsRef.onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if(change.type === 'added'){
          this.setState(prevState => ({
            channels: [...prevState.channels, change.doc.data()]
          }), () => this.setFirstChannel())
        }
        if(change.type === 'modified'){
          console.log('modified channel:', change.doc.data())
        }
        if(change.type === 'renoved'){
          console.log('Removed city:', change.doc.data())
        }
      })
    }, err => {
      console.log(`error, ${err}`)
    })
  }

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if(this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel)
    }
    this.setState({ firstLoad: false, activeChannel: firstChannel.id })
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
      })
      .catch(err => console.error(err));
  }
  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id })
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

  displayChannels = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item 
        key={channel.id} 
        onClick={() => this.changeChannel(channel)} 
        name={channel.name} 
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ))
  )
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
        {this.displayChannels(channels)}
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

export default connect(null, { setCurrentChannel })(Channels);