import React from 'react'

function ProtectedPage(props) {
  return (
    <div>
      welcome {props.user.username}
      <button onClick={props.logout}>Logout</button>
    </div>
  )
}

export default ProtectedPage