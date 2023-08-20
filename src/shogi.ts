
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

type ShogiPosition = Record<`${ShogiRow}${ShogiColumn}`, Piece | null> ;

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
  position: `${ShogiRow}${ShogiColumn}`
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

const BITS: Record<string, number> = {
  NORMAL: 1,
  CAPTURE: 2,
  DROP: 4,
  EP_CAPTURE: 8,
  PAWN_PROMOTION: 16,
  BISHOP_PROMOTION: 32,
  LANCE_PROMOTION: 64,
  KNIGHT_PROMOTION: 128,
  ROOK_PROMOTION: 256,
  SILVER_PROMOTION: 512,
};

type ShogiPieceMovement =
  | "single_step"
  | "backward_step"
  | "forward"
  | "backward"
  | "diagonal"
  | "side_step"
  | "vertical"
  | "front_edge"
  | "back_edge"
  | "knight";

const PieceMovements: Record<PieceSymbol, ShogiPieceMovement[]> = {
  p: ["forward"],
  b: ["diagonal"],
  kn: ["knight"],
  r: ["side_step", "vertical"],
  k: ["single_step"],
  g: ["single_step", "backward_step", "diagonal", "side_step"],
  s: ["single_step", "backward_step", "diagonal", "side_step"],
  l: ["vertical"],
  "+p": ["forward"],
  "+b": ["diagonal"],
  "+kn": ["knight"],
  "+r": ["side_step", "vertical"],
  "+q": ["single_step", "backward_step", "diagonal", "side_step", "vertical"],
  "+g": ["single_step", "backward_step", "diagonal", "side_step"],
  "+s": ["single_step", "backward_step", "diagonal", "side_step"],
  "+l": ["vertical"],
};

// Convert from FEN notation to ShogiPosition
function fenToShogiPosition(fen: string): ShogiPosition {
  const rows = fen.split('/');
  const shogiPosition: ShogiPosition = initial_records_positions;
  const ShogiColumns: ShogiColumn[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

  rows.forEach((row, rowIndex) => {
    let columnIndex = 0;

    let promoted = false;
    for (const char of row) {
      if (/[1-9]/.test(char)) {
        columnIndex += parseInt(char);
      } else {
        const color = char === char.toLowerCase() ? 'w' : 'b';
        let letter = char.toLowerCase();
        if (  letter == '+') {
          promoted = true; 
          continue;
        }
        if (promoted == true) 
        {
          letter = '+${symbol}';
          promoted = false;
        }
        const position = `${9 - rowIndex}${ShogiColumns[columnIndex]}` as `${ShogiRow}${ShogiColumn}`;
        const symbol = letter as PieceSymbol;
        shogiPosition[position] = { color, symbol, position };
        columnIndex++;
      }
    }
  });

  return shogiPosition;
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

export class shogi {
  private _record_board: ShogiPosition = initial_records_positions;
  private _fen_board: string = start_position;
  private _turn: string = "b";
  private _history_records: Array<ShogiPosition> = [];
  private _history_fen: Array<string> = [];
  private _position_count: Record<string, number> = { start_position: 1 }; //using the fen string to check the positions
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

 private  isValidRow(row: number): boolean {
  return row >= 1 && row <= 9;
}

private  isValidColumnIndex(columnIndex: number): boolean {
  return columnIndex >= 0 && columnIndex <= 9;
}

}
