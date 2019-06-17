# Buddha Docs

A rich text editor built built with calming aesthetics and collaboration in mind.
![home](gifs/home_gif.gif)

## To Run
- must have node installed
- git clone this repo
- in your terminal run `npm install` to download electron and other needed packages
- after the packages are finished installing, in your terminal, run `npm run devFront`. You may need to reload your new electron window after the code is finished compiling. Register as a user, login and have fun.

## Tech
- collaborative editing enabled by real-time communication with **SocketIO**
- rich-text editor styling compliments of Facebook's **DraftJS** and it's use of **contentEditable**s
- client side routing via **React**, **React-router's HashRouter**, and all bundled with **Webpack**.
- **React-Materialize** front end styling and components.
- Backend JSON API created with **Node.js** / **Express.js** / **MongoDB** and login and passport hashing provided by **Passport.js** and **bcrypt** -- Backend server hosted on **Heroku**.

## features
-Time travel through previous revisions to your document
![revision](gifs/revisions.gif)
-Send document ids to your friends so you can collab
![share](gifs/shareWID_gif.gif)
-Real time collaboration with ability to detect user selections
![collab](gifs/collab.gif)

### [check out the backend](https://github.com/glazey132/buddha-docs-backend)

### Bugs
There are a few known bugs. I will eventually get around to fixing them. Feel free to document or fix any issues you find.
