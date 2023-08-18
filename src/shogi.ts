import { ListFormat } from "typescript";
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
  type: PieceSymbol;
  prmoted?: boolean;
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

type ShogiColumn = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i";
type ShogiRow = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type ShogiPosition = Record<`${ShogiRow}${ShogiColumn}`, PieceSymbol | null>;

// Convert from FEN notation to ShogiPosition
export function fenToShogiPosition(fen: string): ShogiPosition {
  const [fenPosition] = fen.split(" ");
  const rows = fenPosition.split("/");
  const position: ShogiPosition = {
    "1a": null,
    "1b": null,
    "1c": null,
    "1d": null,
    "1e": null,
    "1f": null,
    "1g": null,
    "1h": null,
    "1i": null,
    "2a": null,
    "2b": null,
    "2c": null,
    "2d": null,
    "2e": null,
    "2f": null,
    "2g": null,
    "2h": null,
    "2i": null,
    "3a": null,
    "3b": null,
    "3c": null,
    "3d": null,
    "3e": null,
    "3f": null,
    "3g": null,
    "3h": null,
    "3i": null,
    "4a": null,
    "4b": null,
    "4c": null,
    "4d": null,
    "4e": null,
    "4f": null,
    "4g": null,
    "4h": null,
    "4i": null,
    "5a": null,
    "5b": null,
    "5c": null,
    "5d": null,
    "5e": null,
    "5f": null,
    "5g": null,
    "5h": null,
    "5i": null,
    "6a": null,
    "6b": null,
    "6c": null,
    "6d": null,
    "6e": null,
    "6f": null,
    "6g": null,
    "6h": null,
    "6i": null,
    "7a": null,
    "7b": null,
    "7c": null,
    "7d": null,
    "7e": null,
    "7f": null,
    "7g": null,
    "7h": null,
    "7i": null,
    "8a": null,
    "8b": null,
    "8c": null,
    "8d": null,
    "8e": null,
    "8f": null,
    "8g": null,
    "8h": null,
    "8i": null,
    "9a": null,
    "9b": null,
    "9c": null,
    "9d": null,
    "9e": null,
    "9f": null,
    "9g": null,
    "9h": null,
    "9i": null,
  };

  rows.forEach((row, rowNum) => {
    let colNum = 1;

    for (const char of row) {
      if (/[1-9]/.test(char)) {
        colNum += parseInt(char, 10);
      } else {
        const key = `${rowNum + 1}${String.fromCharCode(
          "a".charCodeAt(0) + colNum - 1
        )}` as `${ShogiRow}${ShogiColumn}`;
        position[key] = char as PieceSymbol;
        colNum++;
      }
    }
  });

  return position;
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
      this.update_position_count(fen);
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

  private update_position_count(fen: string) {
    if (this._position_count[fen] == null) {
      this._position_count[fen] = 1;
    } else {
      this._position_count[fen]++;
    }
  }

  private check_draws(fen: string) {
    if (this._position_count[fen] >= 3) {
      this._match_status = "draw";
    }
  }
}
