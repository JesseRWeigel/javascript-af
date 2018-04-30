import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'
import Layout from '../components/UserLayout'
import GitIcon from '../assets/icons/github'
import { LinkBtn } from '../components/Button'
import styled from 'styled-components'
import gql from 'graphql-tag'
import withData from '../apollo/wihData'
import withAuth from '../components/withAuth'
import MailIcon from '../assets/icons/envelope'
import UserIcon from '../assets/icons/account'
import RepoCard from '../components/PostCard'

const profileQuery = gql`
  query profileQuery($id: ID!) {
    getUserById(id: $id) {
      name
      username
      githubURL
      email
      photoURL
      bio
    }
    getReposByUser(id: $id) {
      _id
      name
      description
      url
      posted
    }
  }
`

const Container = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'main extras'
    'main extras'
    'main extras'
    'main .';
  @media all and (max-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
  @media all and (max-width: 790px) {
    display: flex;
    flex-direction: column;
  }
`

const UserContainer = styled.div`
  grid-area: extras;
  padding: 0.7rem;
  @media all and (max-width: 790px) {
    margin: 0 0 1rem 0;
  }
  width: 100%;
  & > img {
    display: block;
    margin: 0 auto;
    width: 80%;
    border-radius: 5px;
  }
  & > h3 {
    font-size: 1.75rem;
    margin-top: 0.75rem;
    margin-bottom: 0.25rem;
  }
  & > h4 {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    margin: 0.25rem 0;
    svg {
      fill: ${props => props.theme.primaryDark};
      width: 24px;
      height: auto;
      margin-right: 0.5rem;
    }
  }
  & > p {
    font-size: 1rem;
    margin: 0.25rem 0;
  }
  background: #fff;
`
const GitBtn = LinkBtn.extend`
  width: 100%;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  word-break: break-all;
  margin-top: 0.5rem;
`

const ContentContainer = styled.div`
  grid-area: main;
`

class ProfilePage extends Component {
  static getInitialProps = ({ query }) => {
    return { query }
  }
  render() {
    return (
      <Fragment>
        <Query
          fetchPolicy="network-only"
          query={profileQuery}
          variables={{
            id: this.props.query.id
          }}
        >
          {({ data, loading, error }) => {
            if (loading) {
              return <Layout title="Loading">Loading...</Layout>
            }
            if (error) {
              return <Layout title="Error">Error...</Layout>
            }
            const {
              getUserById: { name, username, email, githubURL, photoURL, bio },
              getReposByUser
            } = data
            return (
              <Layout title={`${name}'s profile`}>
                <Container>
                  <UserContainer>
                    <img src={photoURL} alt={`${name}'s profile picture`} />
                    <h3>{name}</h3>
                    <h4>
                      <UserIcon /> {username}
                    </h4>
                    <h4>
                      <MailIcon /> {email}
                    </h4>
                    <p>{bio || 'No bio available'}</p>
                    <GitBtn href={githubURL} target="_blank" rel="noopener">
                      <GitIcon
                        style={{
                          fill: '#fff',
                          height: 'auto',
                          width: '1.7rem'
                        }}
                      />&nbsp; Go to Github profile
                    </GitBtn>
                  </UserContainer>
                  <ContentContainer>
                    {getReposByUser.map(item => (
                      <RepoCard
                        key={item._id}
                        repoId={item._id}
                        title={item.name}
                        text={item.description}
                        posted={item.posted}
                        url={item.url}
                      />
                    ))}
                  </ContentContainer>
                </Container>
              </Layout>
            )
          }}
        </Query>
      </Fragment>
    )
  }
}

export default withData(withAuth(ProfilePage))
