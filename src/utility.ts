// constants

export const initial_records_positions = {
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
