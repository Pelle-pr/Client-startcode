import React, { useState, useEffect } from "react";
import { useLazyQuery, gql, useMutation } from "@apollo/client"



interface IInput {
    email: string
}
interface IGetFriend {
    getFriendByEmail?: IEditFriend
}
interface IEditFriend {
    firstName: string
    lastName: string
    email: string
    role: string

}
interface IKeyableFriend extends IEditFriend {
    [key: string]: any
}

const DELETE_FRIEND = gql`
mutation getFriendByEmail($email: String!) {deleteFriend(email: $email)
}`


const GET_FRIEND = gql`
 query getFriendByEmail($email: String!) 
 {getFriendByEmail(email: $email)
 {firstName lastName email role}
}`
const EDIT_FRIEND = gql`
mutation adminEditFriend($input:AdminFriendEditInput ) 
{adminEditFriend(input: $input)
{firstName lastName}
}`

export default function FindFriend() {
    const [email, setEmail] = useState("")
    const [getFriendByEmail, { loading, called, data, error }] = useLazyQuery<IGetFriend, IInput>(
        GET_FRIEND,
        { fetchPolicy: "cache-and-network" }
    );
    const [editFriend] = useMutation<any>(
        EDIT_FRIEND
    );
    const [deleteFriend] = useMutation<any>(
        DELETE_FRIEND
    );

    const [friendToEdit, setFriendToEdit] = useState<any>({ firstName: "", lastName: "", email: "", role: "" })

    const handleChange = (event: any) => {
        const id = event.currentTarget.id;
        let friendToChange: IKeyableFriend = { ...friendToEdit }
        friendToChange[id] = event.currentTarget.value;
        setFriendToEdit({ ...friendToChange })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        delete friendToEdit.role
        delete friendToEdit.__typename
        editFriend({ variables: { input: friendToEdit } })
    }

    const handleDelete = (event: any) => {
        event.preventDefault();
        deleteFriend({ variables: { email: friendToEdit.email } })
        setFriendToEdit({ firstName: "", lastName: "", email: "", role: "" })
    }

    useEffect(() => {
        setFriendToEdit({ ...data?.getFriendByEmail });

    }, [data]);




    return (<div style={style}>
        Email: <input type="txt" value={email} onChange={e => {
            setEmail(e.target.value)
        }}></input>
    &nbsp;<button onClick={() => getFriendByEmail({ variables: { email: email } })}>Find Friend</button>
        <br />
        <br />
        {error && <p>{JSON.stringify(error.graphQLErrors[0].message)}</p>}
        {called && loading && <p>Loading...</p>}
        {data && (
            <div>
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
                    <br />
                    <input type="radio" value="user" id="role" checked={friendToEdit.role === "user"} /> User
                    &nbsp;<input type="radio" value="admin" id="role" checked={friendToEdit.role === "admin"} /> Admin
                    <br /><br />
                    <input type="submit" value="Edit friend" />
                    <input type="button" value="Delete" onClick={handleDelete} />
                </form>

            </div>
        )}

    </div>
    )
}
const style = {
    width: 400,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100
}
