// constants

export const initial_records_positions = {
  a1: null,
  b1: null,
  c1: null,
  d1: null,
  e1: null,
  f1: null,
  g1: null,
  h1: null,
  i1: null,
  a2: null,
  b2: null,
  c2: null,
  d2: null,
  e2: null,
  f2: null,
  g2: null,
  h2: null,
  i2: null,
  a3: null,
  b3: null,
  c3: null,
  d3: null,
  e3: null,
  f3: null,
  g3: null,
  h3: null,
  i3: null,
  a4: null,
  b4: null,
  c4: null,
  d4: null,
  e4: null,
  f4: null,
  g4: null,
  h4: null,
  i4: null,
  a5: null,
  b5: null,
  c5: null,
  d5: null,
  e5: null,
  f5: null,
  g5: null,
  h5: null,
  i5: null,
  a6: null,
  b6: null,
  c6: null,
  d6: null,
  e6: null,
  f6: null,
  g6: null,
  h6: null,
  i6: null,
  a7: null,
  b7: null,
  c7: null,
  d7: null,
  e7: null,
  f7: null,
  g7: null,
  h7: null,
  i7: null,
  a8: null,
  b8: null,
  c8: null,
  d8: null,
  e8: null,
  f8: null,
  g8: null,
  h8: null,
  i8: null,
  a9: null,
  b9: null,
  c9: null,
  d9: null,
  e9: null,
  f9: null,
  g9: null,
  h9: null,
  i9: null,
};

interface ShogiFEN {
  piecePlacement: string;
  activeColor: "b" | "w"; // Black starts first
  capturedPieces: { b: []; w: [] };
  promotedPieces: [];
  halfmoveClock: number;
  fullmoveNumber: number;
}

export const initialShogiFEN: ShogiFEN = {
  piecePlacement:
    "lnsgkgsnl/" +
    "1b5r1/" +
    "ppppppppp/" +
    "9/9/" +
    "9/" +
    "PPPPPPPPP/" +
    "1B5R1/" +
    "LNSGKGSNL",
  activeColor: "b", // Black starts first
  capturedPieces: { b: [], w: [] }, // No captured pieces initially
  promotedPieces: [], // No promoted pieces initially
  halfmoveClock: 0, // No captures or pawn moves
  fullmoveNumber: 1, // First move
};

export const start_position =
  initialShogiFEN.piecePlacement +
  ` ${initialShogiFEN.activeColor} - 0 ${initialShogiFEN.fullmoveNumber}`;

export const WHITE = "w";
export const BLACK = "b";

export const PAWN = "p";
export const KNIGHT = "kn";
export const PROMOTED_KNIGHT = "+kn";
export const BISHOP = "b";
export const ROOK = "r";
export const GOLD_GENERAL = "g";
export const SILVER_GENERAL = "s";
export const PROMOTED_SILVER = "+s";
export const LANCE = "l";
export const PROMOTED_LANCE = "+l";
export const DRAGON = "+r"; // promoted rook
export const HORSE = "+b"; // promoted bishop
export const TOKIN = "+p"; // promoted pawn
export const KING = "k";
