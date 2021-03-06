import React from 'react'
import styled from 'styled-components'

/* eslint-disable */
const ModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  height: 100%;
  width: 100%;
  z-index: 999;
  overflow: auto;
  position: fixed;
  top: 0;
  left: 0;
  & .closebtn {
    cursor: pointer;
    color: #fff;
    font-size: 60px;
    position: absolute;
    top: 0;
    right: 10px;
  }
  & .closebtn:hover {
    color: #fd267d;
    transition: 0.5s;
  }
  & .postbg {
    border-radius: 6px;
    background: #fff;
    width: 70%;
    padding: 10px;
    margin: auto;
  }
`
/* eslint-enable */

const Modal = ({ children, show = false, toggle, ...others }) => {
  if (show) {
    return (
      <ModalStyle {...others}>
        <span className="closebtn" onClick={toggle}>
          &times;
        </span>
        <div className="postbg">{children}</div>
      </ModalStyle>
    )
  }
  return null
}

export default Modal
