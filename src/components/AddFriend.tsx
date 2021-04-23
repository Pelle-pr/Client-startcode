import React, { useState } from "react";
import IFriend from "../interfaces/interfaces"
import { gql, useMutation } from "@apollo/client"

type AddFriendProps = {
  initialFriend?: IFriend
}

interface IKeyableFriend extends IFriend {
  [key: string]: any
}
const AddFriend = ({ initialFriend }: AddFriendProps) => {
  const EMPTY_FRIEND: IFriend = { firstName: "", lastName: "", email: "", password: "" }
  let newFriend: any = initialFriend ? initialFriend : { ...EMPTY_FRIEND }

  const [friend, setFriend] = useState({ ...newFriend })

  const ADD_FRIEND = gql`
  mutation createFriend($friend:FriendInput) {
  createFriend(input:$friend){
    firstName
    lastName
    email
    id
  }
}
  `

  const handleChange = (event: any) => {
    const id = event.currentTarget.id;
    let friendToChange: IKeyableFriend = { ...friend }
    friendToChange[id] = event.currentTarget.value;
    setFriend({ ...friendToChange })
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createFriend({ variables: { friend: { ...friend } } })
    setFriend({ ...EMPTY_FRIEND })
  }

  const [createFriend, { data, error, loading }] = useMutation(ADD_FRIEND)

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          FirstName<br />
          <input type="text" id="firstName" value={friend.firstName} onChange={handleChange} />
        </label>
        <br />
        <label>
          LastName <br />
          <input type="text" id="lastName" value={friend.lastName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email <br />
          <input type="email" id="email" value={friend.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password <br />
          <input type="password" id="password" value={friend.password} onChange={handleChange} />
        </label>
        <br /><br />
        <input type="submit" value="Create friend" />
      </form>
      { loading && <p>Loading....</p>}
      { error && <p>{error.message}</p>}
      { data && <p>{data.createFriend.firstName} has been added and given ID: {data.createFriend.id}</p>}
    </div >
  );
}

export default AddFriend;