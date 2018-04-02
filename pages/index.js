import React, { Component } from 'react'
import Layout from '../components/DefaultLayout'
import styled, { ThemeProvider } from 'styled-components'
import withData from '../apollo/wihData'
import theme from '../lib/theme'

const Welcome = styled.div`
  background-position: center;
  background-size: cover;
  background-image: url('/static/loginimg.jpg');
  box-shadow: 0 5px 5px -5px #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 90vh;
  padding: 10px;
  & ul {
    background: rgba(255, 255, 255, 0.6);
    width: 60%;
    margin-top: 50px;
    margin-bottom: 50px;
    padding: 50px;
  }
  & ul h1 {
    color: #000;
    margin-bottom: 10px;
    font-size: 60px;
  }
  & p {
    color: #000;
    font-size: 18px;
  }
  @media (max-width: 991px) {
    & ul {
      width: auto;
      position: relative;
      left: 0;
    }
    & ul h1 {
      font-size: 50px;
    }
  }
  @media (height: 1024px) {
    & ul h1 {
      font-size: 60px;
    }
  }
  @media (width: 1024px) {
    & ul {
      width: 80%;
      position: relative;
      left: 5%;
    }
  }
`

class Index extends Component {
  render () {
    return (
      <ThemeProvider theme={theme}>
        <Layout>
          <Welcome>
            <ul>
              <h1>JavaScript...always fun</h1>
              <p>
                Showcasing unique and interesting JavaScript projects. Login
                with GitHub to add or browse repositories.
              </p>
            </ul>
          </Welcome>
        </Layout>
      </ThemeProvider>
    )
  }
}

export default withData(Index)
