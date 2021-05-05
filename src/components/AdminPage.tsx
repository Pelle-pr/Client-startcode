import React, { useState, useEffect } from "react";
import { useLazyQuery, gql, useMutation } from "@apollo/client"



interface IInput {
    email?: string
    id?: string
}
interface IGetFriend {
    getFriendByEmail?: IEditFriend
    getFriendById?: IEditFriend
}
interface IEditFriend {
    firstName: string
    lastName: string
    email: string
    password: string
    role: string

}
interface IKeyableFriend extends IEditFriend {
    [key: string]: any
}

const DELETE_FRIEND = gql`
mutation getFriendByEmail($email: String!) {deleteFriend(email: $email)
}`

const GET_FRIEND_BY_ID = gql`
 query getFriendById($id: String!) 
 {getFriendById(id: $id)
 {firstName lastName email role password}
}`

const GET_FRIEND_BY_EMAIL = gql`
 query getFriendByEmail($email: String!) 
 {getFriendByEmail(email: $email)
 {firstName lastName email role password}
}`

const EDIT_FRIEND = gql`
mutation adminEditFriend($input:FriendEditInput ) 
{adminEditFriend(input: $input)
{firstName lastName email role password}
}`

export default function AdminPage() {
    const [emailorId, setemailOrId] = useState("")
    const [getFriendByEmail, { loading, called, data, error }] = useLazyQuery<IGetFriend, IInput>(
        GET_FRIEND_BY_EMAIL,
        { fetchPolicy: "no-cache" }
    );
    const [getFriendById, { loading: loadingId, called: calledId, data: dataId, error: errorId }] = useLazyQuery<IGetFriend, IInput>(
        GET_FRIEND_BY_ID,
        { fetchPolicy: "no-cache" }
    );
    const [editFriend] = useMutation<any>(
        EDIT_FRIEND
    );
    const [deleteFriend] = useMutation<any>(
        DELETE_FRIEND
    );

    const [friendToEdit, setFriendToEdit] = useState<any>({ firstName: "", lastName: "", email: "", role: "", password: "" })

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
        setFriendToEdit({ firstName: "", lastName: "", email: "", role: "" })
    }

    useEffect(() => {
        if (data?.getFriendByEmail) {
            setFriendToEdit({ ...data?.getFriendByEmail })
        } else {
            setFriendToEdit({ ...dataId?.getFriendById })
        };

    }, [data, dataId]);

    const fetchFriendByEmailOrId = (event: any) => {
        event.preventDefault()
        if (emailorId.includes("@")) {
            getFriendByEmail({ variables: { email: emailorId } })

        } else {
            getFriendById({ variables: { id: emailorId } })
        }
    }


    return (<div style={style}>
        Email or ID: <input type="txt" value={emailorId} onChange={e => {
            setemailOrId(e.target.value)
        }}></input>
    &nbsp;<button onClick={fetchFriendByEmailOrId}>Find Friend</button>
        <br />
        <br />
        {(error || errorId) && <p>{error?.message}</p>}
        {(called || loading) && (calledId || loadingId) && <p>Loading...</p>}
        {(data || dataId) && (
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
