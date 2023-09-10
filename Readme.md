# Sh0gi JS
This package provides a JavaScript library to simulate a game of Shogi (Japanese Chess). It includes APIs to manage the game state, move pieces around the board, track game history, and determine the status of the game.
## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
   - [Initialize a Shogi game](#initialize-a-shogi-game)
   - [Clear a Shogi game](#clear-a-shogi-game)
   - [Get Available Moves](#get-available-moves)
   - [Move a Piece](#move-a-piece)
- [Contributing](#contributing)
- [License](#license)
## Installation
To install Shogi JS in your project using NPM, use the following command:
npm install sh0gi
## Usage
### Initialize a Shogi game
To start a new game, create an instance of the shogi class. You can also pass an FEN string to start the game from a specific position:
typescript
import { sh0gi } from 'sh0gi';

const game = new shogi('FEN string'); // initialise with FEN string
const game = new shogi(); // initialise with the default start position
### Clear a Shogi game
To clear the current game state:
typescript
game.clear();
### Get Available Moves
To get an array of all valid moves for a piece:
typescript
const piece = game.find_piece('color', 'symbol');  
const moves = game.get_available_moves(piece.notation);
### Move a Piece
To make a move:
typescript
const piece = // obtain piece instance from game
game.move_piece(piece, 'destination square');
## Contributing
Contributions are always welcome. If you want to contribute to this project, please fork the repository and submit a pull request.
## License
This project is licensed under the MIT License.