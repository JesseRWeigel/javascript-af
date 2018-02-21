import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { Messages, MessageBar } from './styles/MessagingStyles'

const MsgContainer = styled.div`
  position: relative;
  background: 0 0;
  margin: 0.5rem 0 0;
  padding: 0.5rem 0 0;
  border: none;
  border-top: none;
  line-height: 1.2;
  margin-left: 0.5rem;
  & .img {
    display: block;
    width: 2.5rem;
    height: auto;
    float: left;
    margin: 0.2rem 0 0;
  }
  & img {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    border-radius: 0.25rem;
  }
  & .data {
    margin-left: 3.5rem;
  }
  & .author {
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.87);
    font-weight: 700;
  }
  & .date {
    display: inline-block;
    margin-left: 0.5rem;
    color: rgba(0, 0, 0, 0.4);
    font-size: 0.7rem;
  }
  & .text {
    margin: 0.25em 0 0.5rem;
    font-size: 1rem;
    word-wrap: break-word;
    color: rgba(0, 0, 0, 0.87);
    line-height: 1.3;
  }
`

const Message = ({ text, date, image, author }) => {
  return (
    <MsgContainer>
      <div className="img">
        <img src={image} alt="" />
      </div>
      <div className="data">
        <div className="author">
          {author}
          <span className="date">{new Date(date).toLocaleString()}</span>
        </div>
        <div className="text">{text}</div>
      </div>
    </MsgContainer>
  )
}

class MessagesRoute extends Component {
  constructor (props) {
    super()
    this.state = {
      messages: props.getMessages.getMessages,
      message: ''
    }
  }
  handleChange = e => {
    this.setState({
      message: e.target.value
    })
  }
  sendMessage = async e => {
    e.preventDefault()
    const { message } = this.state
    if (message) {
      this.setState({
        message: ''
      })
      this.props
        .mutate({
          variables: { text: message, channelId: this.props.match.params.id }
        })
        .catch(error => {
          console.log('there was an error sending the query', error)
        })
    }
  }
  componentDidMount () {
    this.props.subscribeToNewMessages({
      channelId: this.props.match.params.id
    })
  }

  render () {
    const { getMessages, loading } = this.props.getMessages
    if (loading || !getMessages) {
      return null
    }
    return (
      <Fragment>
        <Messages>
          {getMessages.map(item => (
            <Message
              key={item._id}
              text={item.text}
              date={item.createdAt}
              image={item.author.photoURL}
              author={item.author.name}
            />
          ))}
        </Messages>
        <MessageBar>
          <form onSubmit={this.sendMessage}>
            <input
              value={this.state.message}
              onChange={this.handleChange}
              type="text"
              placeholder="Whats in your mind..."
            />
          </form>
        </MessageBar>
      </Fragment>
    )
  }
}

const MsgSubscriptions = gql`
  subscription newMessage($channelId: ID!) {
    msg(channelId: $channelId) {
      _id
      text
      channelId
      author {
        name
        photoURL
      }
      createdAt
    }
  }
`

const MessageQuery = gql`
  query MessagesQuery($channelId: ID!, $offset: Int) {
    getMessages(channelId: $channelId, offset: $offset) {
      createdAt
      author {
        name
        photoURL
      }
      channelId
      _id
      text
    }
  }
`

const sendMessage = gql`
  mutation sendMessage($text: String!, $channelId: ID!) {
    createMessage(text: $text, channelId: $channelId) {
      _id
      createdAt
    }
  }
`

export default compose(
  graphql(MessageQuery, {
    name: 'getMessages',
    options: ({ match: { params } }) => ({
      variables: { channelId: params.id, offset: 1 }
    }),
    props: props => {
      return {
        ...props,
        subscribeToNewMessages: params => {
          return props.getMessages.subscribeToMore({
            document: MsgSubscriptions,
            variables: {
              channelId: params.channelId
            },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                return prev
              }

              const newFeedItem = subscriptionData.data.msg
              return Object.assign({}, prev, {
                getMessages: [newFeedItem, ...prev.getMessages]
              })
            }
          })
        }
      }
    }
  }),
  graphql(sendMessage)
)(MessagesRoute)
