import React from 'react'

function ProtectedPage(props) {
  console.log(props.user)
  return (
    <div>
      welcome {props.user.username}
      <button onClick={props.logout}>Logout</button>
    </div>
  )
}

export default ProtectedPage