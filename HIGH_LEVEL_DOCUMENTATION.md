# Barbie Uno High-Level Technical Document

This document outlines and explains the technologies & Components used within Barbie-Uno.

## Back-end Server
Barbie uno utilizes a back-end server for features such as creating online lobbies, handling game events, and preventing client-sided cheating. All API should be made here.

A back-end server can also be utilized to create features such as accounts with data, or any other security-sensitive transactions

Important technologies and components used in the back-end follow below.

### Websockets

The back-end utilizes this technology to create game lobbies, and handle game events between the server and the client. 

Files related to websockets are found within the websocket folder and explanations follow: 

#### game-events.js

This file contains all functions related to game events, and prepares an exported function for socket injection of the game events. 

#### websocket-connection-handler.js

This file contains functions related to handling incoming web sockets. This includes features such as game lobby creation, game lobby joining, and user identification. The file also stores and exports all game lobbies ever created within the array named "games".


## Front-End Website
Barbie Uno uses React as the main library used to create the website seen by users . The website will be served by the back-end server when in production, but for now, is served using Vite during development.

 The important technologies and components used by the front end follow below.

### React
React is the dominant industry-standard library for creating front-end web development, such as websites and applications. It combines HTML and javascript, making it easy to create dynamic and interactive websites. It also allows for the use of components, which are like Classes & Objects in Java except for React HTML components.

The following files are found within the React Project and are explained below:

#### Main.jsx
Outermost website element, not usually modified.

#### App.jsx 
Outermost application element. All global application logic should exist here (I.E things that should exists in every single webpage). This file also defines all pages that exist within the app using React-Router, another library.

Page files are found in the Pages folders and as follows:

#### Home.jsx
Default landing page for the user. Welcomes user, and shows options to either make a game, or go to the websocket debug page.
Definitely change into a more welcoming page.

#### Game.jsx
Currently contains front-end UI for inputting a game code and identification (username) and either creating a lobby, or joining one.
After the game starts, it brings up game UI.
This should be changed into only handling the in-game UI.

#### Socket.jsx
Debugging page for the websocket. Here, you can create your own websocket requests with your own data.
Will not exist in production.

### Card.jsx Component
A component is a commonly re-used React element. Components behave simillarly to how Classes do in Java.
This Card component is utilized within GameUI.jsx component in order to render the players' hand. The file has functions to splice the correct card texture from the card spreadsheet.

### GameUI.jsx Component
This component defines the UI elements of Game.jsx and their functions. This component is shown in Game.jsx after the user joins a lobby.

### Vite
Vite is the tool being used to create the web server specifically for development. 
It's used for it's very high-performance, and the Hot Module Replacement (HMR) feature, which immedietly updates the website when you make a code change without needing to refresh, and without losing the applications current state.

Vite should not be used for production, however, it will be used to build the files for production.

There is no other information I know about Vite. It probably isn't important.

To run the webserver, open a terminal at the barbie-uno folder, and run : npm run dev