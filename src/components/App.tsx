import React from "react";
import "../App.css"
import {
  //BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import { useState } from "react"
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import Header from "./Header"
import AddFriend from "./AddFriend";
import AllFriends from "./AllFriends"
import FindFriend from "./FindFriend"
import Login from "./Login"
import Home from "./Home"
import settings from "../utils/settings.json"
const graphqlURL = settings.graphqlEndpoint;

const httpLink = createHttpLink({ uri: graphqlURL })

let client: any

//Todo 4 --> follow this link, and figure out what goes on here 
// When you have figured it out, ADD a description on top of the method --> we will do this together
// https://www.apollographql.com/docs/react/networking/authentication/
export function makeClient() {
  const authLink = setContext((_, { headers }) => {
    const base64Token = localStorage.getItem('base64AuthString');
    return {
      headers: {
        ...headers,
        Authorization: base64Token ? base64Token : ""
      }
    }
  });
  client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })
  client.resetStore()
}
makeClient()

export default function App() {


  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("base64AuthString") !== null)
  const history = useHistory()

  const setLoginStatus = (status: boolean) => {
    setIsLoggedIn(status)
    history.push("/")
  }

  return (
    <div>
      <Header loginMsg={isLoggedIn ? "Logout" : "Login"} isLoggedIn={isLoggedIn} setLoginStatus={setLoginStatus} />
      {/* <hr /> */}
      <ApolloProvider client={client}>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/allFriends">
              <AllFriends />
            </Route>
            <Route path="/addFriend">
              <AddFriend />
            </Route>
            <Route path="/findFriend">
              <FindFriend />
            </Route>
            <Route path="/login" >
              <Login setLoginStatus={setLoginStatus} />
            </Route>
          </Switch>
        </div>
      </ApolloProvider>
    </div>
  );
}

