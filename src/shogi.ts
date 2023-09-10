import { initial_records_positions, start_position } from "../src/utility";

// custom types

export type Color = "w" | "b";
export type Status = "on" | "draw" | "abort" | "white wins" | "black wins";
// prettier-ignore
export type PieceSymbol =
  | "p"
  | "b"
  | "kn"
  | "r"
  | "k"
  | "g"
  | "s"
  | "l"
  | "+p"
  | "+b"
  | "+kn"
  | "+r"
  | "+q"
  | "+g"
  | "+s"
  | "+l";

export type PiceMovements = Record<PieceSymbol, [number, number]>;
type ShogiColumn = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i";
type ShogiRow = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type ShogiPosition = Record<Square, Piece | null>;

// prettier-ignore
export type Square =
    'a9' | 'b9' | 'c9' | 'd9' | 'e9' | 'f9' | 'g9' | 'h9' | 'i9' |
    'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' | 'i8' |
    'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' | 'i7' |
    'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' | 'i6' |
    'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' | 'i5' |
    'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' | 'i4' |
    'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' | 'i3' |
    'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' | 'i2' |
    'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' | 'i1' ;

export type Piece = {
  color: Color;
  symbol: PieceSymbol;
  position: Square;
  promoted?: boolean;
  captured?: boolean;
};

export type Move = {
  color: Color;
  from: Square;
  to: Square;
  piece: PieceSymbol;
  captured?: PieceSymbol;
  promoted?: boolean;
  droped?: boolean;
  dropped_piece: PieceSymbol | null;
  san: string; // short algebraic notation
  lan: string; // long algebraic notation
  before: string; // position before the move
  after: string; // position after the move
};

type ShogiPieceMovement =
  | "single_step"
  | "backward_step"
  | "forward"
  | "backward"
  | "diagonal"
  | "side_step"
  | "vertical"
  | "horizontal"
  | "front_edge"
  | "back_edge"
  | "knight";

const PieceMovements: Record<PieceSymbol, ShogiPieceMovement[]> = {
  p: ["single_step"],
  b: ["diagonal"],
  kn: ["knight"],
  r: ["horizontal", "vertical"],
  k: ["single_step", "backward_step", "side_step", "front_edge", "back_edge"],
  g: ["single_step", "backward_step", "diagonal", "side_step"],
  s: ["single_step", "backward_step", "diagonal", "side_step"],
  l: ["forward"],
  "+p": ["forward"],
  "+b": ["diagonal"],
  "+kn": ["knight"],
  "+r": ["side_step", "vertical"],
  "+q": ["single_step", "backward_step", "diagonal", "side_step", "vertical"],
  "+g": ["single_step", "backward_step", "diagonal", "side_step"],
  "+s": ["single_step", "backward_step", "diagonal", "side_step"],
  "+l": ["vertical"],
};

export function arrayNotationToSquare(arrayNotation: [number, number]): Square {
  return `${String.fromCharCode(arrayNotation[0] + 97)}${(
    arrayNotation[1] + 1
  ).toString()}` as Square;
}

export function isValidIndex(index: number): boolean {
  return index >= 0 && index <= 8;
}

// Convert from FEN notation to ShogiPosition
function fenToShogiPosition(fen: string): ShogiPosition {
  const rows = fen.split("/");
  const shogiPosition: ShogiPosition = initial_records_positions;
  const ShogiColumns: ShogiColumn[] = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
  ];

  rows.forEach((row, rowIndex) => {
    let columnIndex = 0;

    let promoted = false;
    for (const char of row) {
      if (/[1-9]/.test(char)) {
        columnIndex += parseInt(char);
      } else {
        const color = char === char.toLowerCase() ? "w" : "b";
        let letter = char.toLowerCase();
        if (letter == "+") {
          promoted = true;
          continue;
        }
        if (promoted == true) {
          letter = "+${symbol}";
          promoted = false;
        }
        const position = `${9 - rowIndex}${
          ShogiColumns[columnIndex]
        }` as `${ShogiRow}${ShogiColumn}`;
        const symbol = letter as PieceSymbol;
        shogiPosition[position] = { color, symbol, position };
        columnIndex++;
      }
    }
  });

  return shogiPosition;
}

function squareToArray(position: string): [number, number] {
  const row = parseInt(position.slice(0, -1)) - 1;
  const column = position.charCodeAt(position.length - 1) - 97;
  return [row, column];
}
// Convert from ShogiPosition to FEN notation
export function shogiPositionToFen(position: ShogiPosition): string {
  let fen = "";

  for (let row = 1; row <= 9; row++) {
    let emptyCount = 0;

    for (const col of ["a", "b", "c", "d", "e", "f", "g", "h", "i"]) {
      const key = `${row}${col}` as `${ShogiRow}${ShogiColumn}`;
      const piece = position[key];

      if (piece) {
        if (emptyCount > 0) {
          fen += emptyCount.toString();
          emptyCount = 0;
        }
        fen += piece;
      } else {
        emptyCount++;
      }
    }

    if (emptyCount > 0) {
      fen += emptyCount.toString();
    }

    if (row < 9) {
      fen += "/";
    }
  }

  return fen;
}

function getTurnFromfen(fen: string): "b" | "w" {
  const parts = fen.split(" ");

  if (parts.length >= 2) {
    const turn = parts[1].toLowerCase();
    if (turn === "b" || turn === "w") {
      return turn;
    }
  }

  return "b"; // return inital start black
}

export function get_piece_from_notation(notation: string): Piece | null {
  const regex = /^([wb])(\+?[KGSNRYPBkgsnrypb])([a-i][1-9])$/;
  const match = notation.match(regex);

  if (!match) {
    return null;
  }

  const [, color, pieceSymbolWithPromotion, position] = match;
  const promoted = pieceSymbolWithPromotion.startsWith("+");
  const pieceSymbol = promoted
    ? pieceSymbolWithPromotion.substring(1).toLowerCase()
    : pieceSymbolWithPromotion.toLowerCase();

  const piece: Piece = {
    position: position as Square,
    color: color as Color,
    symbol: pieceSymbol as PieceSymbol,
  };

  return piece;
}

function getAllMovements(piece: Piece): Square[] {
  const movements = PieceMovements[piece.symbol];
  let moves: Square[] = new Array<Square>();
  const arrayNotation = () => [
    piece.position.charCodeAt(0) - 97,
    parseInt(piece.position.charAt(1)) - 1,
  ];
  const column = arrayNotation[0];
  const row = arrayNotation[1];
  let newColumn: number;
  let newRow: number;
  movements.forEach((movement) => {
    switch (movement) {
      case "single_step":
        newRow = row + 1;
        if (isValidIndex(newRow)) {
          moves.push(arrayNotationToSquare([column, newRow]));
        }
        break;
      case "backward_step":
        newRow = row - 1;
        if (isValidIndex(newRow)) {
          moves.push(arrayNotationToSquare([column, newRow]));
        }
        break;
      case "forward":
        for (let index = row; index < 9; index++) {
          moves.push(arrayNotationToSquare([column, index]));
        }
        break;
      case "horizontal":
        for (let index = row; index < 9; index++) {
          moves.push(arrayNotationToSquare([index, row]));
        }
        break;
      case "diagonal":
        for (let index = 0; index < 9; index++) {
          newRow = row + 1;
          newColumn = column + 1;

          if (isValidIndex(newRow) && isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }

          newRow = row - 1;
          newColumn = column - 1;

          if (isValidIndex(newRow) && isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }

          newRow = row + 1;
          newColumn = column - 1;

          if (isValidIndex(newRow) && isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }

          newRow = row - 1;
          newColumn = column + 1;

          if (isValidIndex(newRow) && isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }
        }
        break;
      case "side_step":
        newColumn = column + 1;
        if (isValidIndex(newColumn)) {
          moves.push(arrayNotationToSquare([newColumn, newRow]));
        }
        newColumn = column - 1;
        if (isValidIndex(newColumn)) {
          moves.push(arrayNotationToSquare([newColumn, newRow]));
        }
        break;
      case "vertical":
        for (let index = 0; index < 9; index++) {
          moves.push(arrayNotationToSquare([column, index]));
        }
        break;
      case "front_edge":
        newRow = row + 1;
        if (isValidIndex(newRow)) {
          newColumn = column + 1;
          if (isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }
          newColumn = column - 1;
          if (isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }
        }
        break;
      case "back_edge":
        newRow = row - 1;
        if (isValidIndex(newRow)) {
          newColumn = column + 1;
          if (isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }
          newColumn = column - 1;
          if (isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }
        }

        break;
      case "knight":
        newRow = row + 2;
        if (isValidIndex(newRow)) {
          newColumn = column + 1;
          if (isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }
          newColumn = column - 1;
          if (isValidIndex(newColumn)) {
            moves.push(arrayNotationToSquare([newColumn, newRow]));
          }
        }
        break;
    }
  });
  return moves;
}

export function filterValidMoves(
  moves: Square[],
  piece: Piece,
  record: ShogiPosition
): Square[] {
  if (piece.symbol in ["k", "kn", "+kn", "p", "+p", "g", "+g", "s", "+s"]) {
    return moves.filter(
      (move) => record[move] == null || record[move]!.color != piece.color
    );
  } else {
    let validMoves = new Array();

    for (const move of moves) {
      const [targetRow, targetCol] = squareToArray(move);
      const [currentRow, currentCol] = squareToArray(piece.position);

      // Check if the path to the target is clear for rook and bishop
      const isPathClear = checkPathClear(
        currentRow,
        currentCol,
        targetRow,
        targetCol,
        record
      );

      if (isPathClear) {
        validMoves.push(move);
      }
    }

    return validMoves;
  }
}

function checkPathClear(
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  record: ShogiPosition
): boolean {
  const rowDelta = Math.sign(endRow - startRow);
  const colDelta = Math.sign(endCol - startCol);

  let currentRow = startRow + rowDelta;
  let currentCol = startCol + colDelta;

  while (currentRow !== endRow || currentCol !== endCol) {
    const square = arrayNotationToSquare([currentRow, currentCol]);

    if (record[square] !== null) {
      return false; // Path is blocked
    }

    currentRow += rowDelta;
    currentCol += colDelta;
  }

  return true; // Path is clear
}

export class shogi {
  private _record_board: ShogiPosition = initial_records_positions;
  private _fen_board: string = start_position;
  private _turn: Color = "b";
  private _history_records: Array<ShogiPosition> = [];
  private _history_fen: Array<string> = [];
  private _position_count: Record<string, number> = { start_position: 1 }; //using the fen string to check the positions
  private _captured_pieces: Record<Color, Piece[]> = { w: [], b: [] };
  private _match_status: Status = "on";

  constructor(fen?: string) {
    if (fen) {
      this._fen_board = fen;
      this._record_board = fenToShogiPosition(fen);
      this._turn = getTurnFromfen(fen);
      this._history_fen.push(fen);
      this.updatePositionCount(fen);
    }
  }

  clear() {
    this._fen_board = start_position;
    this._record_board = initial_records_positions;
    this._turn = "b";
    this._history_fen = new Array<string>();
    this._position_count = { start_position: 1 };
    this._match_status = "abort";
  }

  // private functions

  private updatePositionCount(fen: string) {
    if (this._position_count[fen] == null) {
      this._position_count[fen] = 1;
    } else {
      this._position_count[fen]++;
    }
  }
  // simple helpers
  private checkDraws(fen: string) {
    if (this._position_count[fen] >= 3) {
      this._match_status = "draw";
    }
  }

  private isCheckOrCheckMate() {
    let king: Piece | null = null;
    king = this.find_piece(this._turn, "k");
    if (king == null) {
      throw new Error("King not found");
    }

    let opponent_moves: Square[] = new Array<Square>();
    for (const square in this._record_board) {
      if (
        this._record_board[square] != null &&
        this._record_board[square].color != this._turn
      ) {
        opponent_moves = opponent_moves.concat(
          getAllMovements(this._record_board[square])
        );
      }
    }

    if (opponent_moves.includes(king.position)) {
      let king_movements = getAllMovements(king);
      king_movements.filter((move) => !opponent_moves.includes(move));
      if (king_movements.length == 0) {
        if (this._turn == "w") {
          this._match_status = "white wins";
        } else {
          this._match_status = "black wins";
        }
        return "checkmate";
      } else {
        return "check";
      }
    }

    return "no_check";
  }

  // main functions
  public get_available_moves(notation: string): Square[] {
    let moves: Square[];
    const piece = get_piece_from_notation(notation);
    if (piece == null) {
      throw new Error("Invalid notation");
    }

    moves = getAllMovements(piece);

    moves = filterValidMoves(moves, piece, this._record_board);

    return moves;
  }

  // check emtpy squares to put a piece from captured on the board
  // if the piece to add is a pawn, check if there is a pawn in the same column
  private get_empty_squares(piece: Piece, record: ShogiPosition): Square[] {
    let empty_squares: Square[] = new Array<Square>();

    for (const square in record) {
      if (record[square] == null) {
        empty_squares.push(square as Square);
      }
    }

    if (piece.color == "w") {
      empty_squares = empty_squares.filter((square) => square.charAt(1) <= "6");
    }

    if (piece.color == "b") {
      empty_squares = empty_squares.filter((square) => square.charAt(1) >= "4");
    }

    if (piece.symbol == "p") {
      const rows = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
      const column = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      let found = false;
      rows.forEach((row) => {
        column.forEach((column) => {
          const checkSquare = `${row}${column}` as Square;
          if (
            record[checkSquare] != null &&
            record[checkSquare]!.symbol == "p" &&
            record[checkSquare]!.color == piece.color &&
            found == false
          ) {
            found = true;
          }

          if (record[checkSquare] == null && found == true) {
            empty_squares.filter((square) => square != checkSquare);
          }
        });
        found = false;
      });
    }
    return empty_squares;
  }

  private find_piece(color: Color, symbol: PieceSymbol): Piece | null {
    let piece: Piece | null = null;
    for (const square in this._record_board) {
      if (
        this._record_board[square] != null &&
        this._record_board[square].color == color &&
        this._record_board[square].symbol == symbol
      ) {
        piece = this._record_board[square];
      }
    }
    return piece;
  }

  public move_piece(piece: Piece, to: Square): void {
    if (piece.captured == false) {
      const from = piece.position;
      const moves = this.get_available_moves(from);
      if (moves.includes(to)) {
        const captured =
          this._record_board[to] != null &&
          this._record_board[to]!.color != piece.color
            ? true
            : false;

        if (captured == true) {
          let piece: Piece = this._record_board[to] as Piece;
          piece!.captured = true;
          piece!.promoted = false;
          this._captured_pieces[this._record_board[to]!.color].push(piece);
        }
        // check if promotion is possible
        let promoted: boolean = false;
        // update the board

        this._record_board[to] = piece;
        this._record_board[from] = null;
        if (
          promoted &&
          piece.symbol in ["p", "l", "s", "g", "kn"] &&
          piece.promoted == false
        ) {
          this._record_board[to]!.symbol = `+${piece.symbol}` as PieceSymbol;
          this._record_board[to]!.promoted = true;
        }
      } else {
        throw new Error("Invalid move");
      }
    } else {
      const empty_squares = this.get_empty_squares(piece, this._record_board);
      if (empty_squares.includes(to)) {
        this._record_board[to] = piece;
        this._captured_pieces[piece.color].filter(
          (captured_piece) => captured_piece != piece
        );
      } else {
        throw new Error("Invalid move");
      }
    }
  }
}
