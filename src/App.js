import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';


firebase.initializeApp(firebaseConfig);


function App() 
{
  
  const [user , setUser] = useState({
    isSignIn: false,
    name: "",
    email: "",
    password: "",
    photo:"",
    error: ""
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  
  const handleSignIn = () => {
    console.log("Handle Sign In");
    firebase.auth().signInWithPopup(provider)
    .then(function(result) {
      const {displayName , email , photoURL} = result.user;
        
      const signedInUser = {
        isSignIn: true,
        name: displayName,
        email: email,
        photo:photoURL
      }

      setUser(signedInUser);
      console.log(displayName , email , photoURL);
      // // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // // The signed-in user info.
      var user = result.user;
      // // ...
    }).catch(function(error) {
      console.log("Error", error);
      // Handle Errors here.
      const newUserInfo = [...user];
      newUserInfo.error = error.message;
      var errorMessage = error.message;
      setUser(newUserInfo);
      console.log( errorMessage);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(error);
      console.log(errorMessage);
    });

  }
   

  const handleSignOut = () => {
    firebase.auth().signOut().then(function() {
      const signedOutUser = {isSignIn : false,
      name:'',
      photo:'',
      email: ''
      }
      setUser(signedOutUser);
      
    }).catch(function(error) {
      console.log();
    });
  }

  const handleSubmit = (event) =>{
    console.log(user.email && user.Password );
      if(user.email && user.Password){
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then (res => {
          console.log(res);
        })
        .catch(function(error) {
          console.log(error);
          // Handle Errors here.
          // var errorCode = error.code;
          const newUserInfo = {...user};
          newUserInfo.error = error.Message;
          // var errorMessage = error.message;
          // ...
          // console.log(errorCode, errorMessage);
        });
      }

      event.preventDefault();
  }

  const handleBlur = (event) => {
           
             const newUserInfo = {...user};
             newUserInfo[event.target.name] = event.target.value;
             setUser(newUserInfo);
          let isFieldValid = true ;
          
          if(event.target.name === "Email"){
            isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
          }

          if(event.target.name === "Password"){
            const isPasswordValid = event.target.value.length > 6;
            const passwordHasNumber =  /\d{1}/.test(event.target.value)
            isFieldValid = isPasswordValid && passwordHasNumber;
          }

          if(isFieldValid){
             const newUserInfo = {...user};
             newUserInfo[event.target.name] = event.target.value;
             setUser(newUserInfo);
             console.log(newUserInfo);
          }
  }
  return (
    <div>
 {
         user.isSignIn? <button onClick = {handleSignOut}>Sign Out</button>:
         <button onClick = {handleSignIn}>Sign In</button>

 }


      {
        user.isSignIn && 
        <div>
        <p>Welcome , {user.name}</p>
        <h4>Your Email: {user.email}</h4>
        <img src = {user.photo} alt= "Your Image" style = {{width: '100px'}}></img>
        </div>
      }


      <h1>Our own Authentication </h1>
      
      <form onSubmit = {handleSubmit}>
          <input onBlur = {handleBlur} type="text" name="email" placeholder = "Your Email" required/>
          <br/>
          <input onBlur = {handleBlur} type="password" name="password" id="" placeholder = "Password" required/>
          <br/>
          <input type="submit" value="Submit"/>
          <p style = {{color: 'red'}}>{user.error}</p>
      </form>

        <p style = {{color:'red'}}>{user.error}</p>
    </div>
  );
}

export default App;
