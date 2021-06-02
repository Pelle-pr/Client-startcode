import React, { useState, useEffect } from "react";
import { useLazyQuery, gql, useMutation } from "@apollo/client"



interface IEditFriend {
    firstName: string
    lastName: string
    email: string
    password?: string
    role?: string
    __typename?: string

}
interface ErrorMsg {
    msg: string
    code: number
}
interface IKeyableFriend extends IEditFriend {
    [key: string]: any
}

const DELETE_FRIEND = gql`
mutation deleteFriend($email: String!) {deleteFriend(email: $email)
}`

const GET_FRIEND_BY_EMAIL = gql`
  query getFriendByEmail($email: String!) 
  { getFriendByEmail(email: $email) {
    ...on Friend{
      firstName
      lastName
      email
      role
      password
    }
    ...on Error{
      msg
      code
    }
  }}`

const EDIT_FRIEND = gql`
mutation adminEditFriend($input:FriendEditInput ) 
{adminEditFriend(input: $input)
{firstName lastName email role password}
}`

export default function AdminPage() {
    const [email, setEmail] = useState("")
    const [errorMsg, setErrorMsg] = useState<any>()
    const [getFriendByEmail, { loading, data, error }] = useLazyQuery(GET_FRIEND_BY_EMAIL, { "fetchPolicy": "no-cache" });
    const [editFriend, { error: editError }] = useMutation<IEditFriend>(EDIT_FRIEND, { onError: (err) => setErrorMsg(err) })
    const [deleteFriend] = useMutation<any>(DELETE_FRIEND);
    const [friendToEdit, setFriendToEdit] = useState<IEditFriend>({ firstName: "", lastName: "", email: "", role: "", password: "" })

    const handleChange = (event: any) => {
        const id = event.currentTarget.id;
        let friendToChange: IKeyableFriend = { ...friendToEdit }
        friendToChange[id] = event.currentTarget.value;
        setFriendToEdit({ ...friendToChange })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (friendToEdit.password === null) {
            delete friendToEdit.password
        }
        delete friendToEdit.role
        delete friendToEdit.__typename
        editFriend({ variables: { input: friendToEdit } })
    }

    const handleDelete = (event: any) => {
        event.preventDefault();
        deleteFriend({ variables: { email: friendToEdit.email } })
        setFriendToEdit({ firstName: "", lastName: "", email: "", role: "", password: "" })
    }

    const handleFind = (event: any) => {
        event.preventDefault()
        getFriendByEmail({ variables: { email: email } })
    }

    useEffect(() => {
        if (data?.getFriendByEmail.__typename === "Friend") {
            setErrorMsg(undefined)
            setFriendToEdit({ ...data.getFriendByEmail })
        }
        if (data?.getFriendByEmail.__typename === "Error") {
            setFriendToEdit({ firstName: "", lastName: "", email: "", role: "" })
            setErrorMsg({ ...data.getFriendByEmail })
        }
    }, [data]);


    return (<div style={style}>
        Email: <input type="txt" value={email} onChange={e => { setEmail(e.target.value) }}></input>

        &nbsp;<button onClick={handleFind}>Find Friend</button>
        {loading && <p>Loading....</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {editError && <p style={{ color: "red" }}>{editError.message}</p>}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg.msg}</p>}
        <br />
        <br />
        {data && <div>
            <form onSubmit={handleSubmit} >
                <label>
                    FirstName<br />
                    <input type="text" id="firstName" value={friendToEdit.firstName} onChange={handleChange} />
                </label>
                <br />
                <label>
                    LastName <br />
                    <input type="text" id="lastName" value={friendToEdit.lastName} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Email <br />
                    <input disabled={true} type="email" id="email" value={friendToEdit.email} />
                </label>
                <label>
                    Password <br />
                    <input type="password" id="password" value={friendToEdit.password} onChange={handleChange} />
                </label>
                <br />
                <input type="radio" value="user" id="role" checked={friendToEdit.role === "user"} /> User
                    &nbsp;<input type="radio" value="admin" id="role" checked={friendToEdit.role === "admin"} /> Admin
                    <br /><br />
                <input type="submit" value="Edit friend" />
                <input type="button" value="Delete" onClick={handleDelete} />
            </form>
        </div>}
    </div>

    )

}
const style = {
    width: 400,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100
}
