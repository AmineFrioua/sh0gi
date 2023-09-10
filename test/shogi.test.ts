import "mocha";
import {
  arrayNotationToSquare,
  fenToShogiPosition,
  getTurnFromfen,
  shogiPositionToFEN,
  ShogiPosition,
} from "../src/shogi";
import { expect } from "chai";

describe("Shogi", () => {
  describe("arrayNotationToSquare", () => {
    it("should convert array notation to square", () => {
      const result = arrayNotationToSquare([0, 0]);
      expect(result).to.equal("a1");
    });

    it("should convert array notation to square", () => {
      const result = arrayNotationToSquare([8, 8]);
      expect(result).to.equal("i9");
    });
  });
  describe("getTurnFromfen", () => {
    it("should return 'b' if fen corresponds to a game state where it is black`s turn", () => {
      const fen =
        "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b -";
      const result = getTurnFromfen(fen);
      expect(result).to.equal("b");
    });

    it("should return 'w' if fen corresponds to a game state where it is white`s turn", () => {
      const fen =
        "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL w -";
      const result = getTurnFromfen(fen);
      expect(result).to.equal("w");
    });

    it("should return 'b' if fen lacks information about which player`s turn it is", () => {
      const fen = "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL -";
      const result = getTurnFromfen(fen);
      expect(result).to.equal("b");
    });

    it("should return 'b' if fen is empty", () => {
      const fen = "";
      const result = getTurnFromfen(fen);
      expect(result).to.equal("b");
    });
  });
  describe("fenToShogiPosition", () => {
    it("should correctly transform a fen string into a ShogiPosition", () => {
      const fen =
        "lnsgkgsnl/1r5b1/ppppppppp/9/9/2P6/PP1PPP1PP/1B5R1/LNSGKGSNL b -";
      const result = fenToShogiPosition(fen);
      expect(result).to.be.an("object");
      console.log(result);

      expect(result["a1"]).to.eql({ color: "b", symbol: "l", position: "a1" });
      expect(result["i1"]).to.eql({ color: "b", symbol: "l", position: "i1" });
      // add more assertions for other squares as needed
    });

    it("should correctly promote a piece in a fen string to the corresponding ShogiPosition", () => {
      const fen = "lnsgkgsnl/1r5b1/ppppppppp/9/9/2P6/PP1PPP1PP/1B5R1/+L5R1 b -";
      const result = fenToShogiPosition(fen);
      expect(result["a1"]).to.eql({ color: "b", symbol: "+l", position: "a1" });
    });
  });
  describe("shogiPositionToFEN", () => {
    it("should correctly transform a ShogiPosition into a fen string", () => {
      // consider a partial shogi position for simplicity
      const shogiPosition: ShogiPosition = {
        a9: { color: "w", symbol: "l", position: "a9" },
        b9: { color: "w", symbol: "n", position: "b9" },
        c9: { color: "w", symbol: "s", position: "c9" },
        d9: { color: "w", symbol: "g", position: "d9" },
        e9: { color: "w", symbol: "k", position: "e9" },
        f9: { color: "w", symbol: "g", position: "f9" },
        g9: { color: "w", symbol: "s", position: "g9" },
        h9: { color: "w", symbol: "n", position: "h9" },
        i9: { color: "w", symbol: "l", position: "i9" },
        a8: null,
        b8: { color: "w", symbol: "r", position: "b8" },
        c8: null,
        d8: null,
        e8: null,
        f8: null,
        g8: null,
        h8: { color: "w", symbol: "b", position: "h8" },
        i8: null,
        a7: { color: "w", symbol: "p", position: "a7" },
        b7: { color: "w", symbol: "p", position: "b7" },
        c7: { color: "w", symbol: "p", position: "c7" },
        d7: { color: "w", symbol: "p", position: "d7" },
        e7: { color: "w", symbol: "p", position: "e7" },
        f7: { color: "w", symbol: "p", position: "f7" },
        g7: { color: "w", symbol: "p", position: "g7" },
        h7: { color: "w", symbol: "p", position: "h7" },
        i7: { color: "w", symbol: "p", position: "i7" },
        a6: null,
        b6: null,
        c6: null,
        d6: null,
        e6: null,
        f6: null,
        g6: null,
        h6: null,
        i6: null,
        a5: null,
        b5: null,
        c5: null,
        d5: null,
        e5: null,
        f5: null,
        g5: null,
        h5: null,
        i5: null,
        a4: null,
        b4: null,
        c4: { color: "b", symbol: "p", position: "c4" },
        d4: null,
        e4: null,
        f4: null,
        g4: null,
        h4: null,
        i4: null,
        a3: { color: "b", symbol: "p", position: "a3" },
        b3: { color: "b", symbol: "p", position: "b3" },
        c3: null,
        d3: { color: "b", symbol: "p", position: "d3" },
        e3: { color: "b", symbol: "p", position: "e3" },
        f3: { color: "b", symbol: "p", position: "f3" },
        g3: null,
        h3: { color: "b", symbol: "p", position: "h3" },
        i3: { color: "b", symbol: "p", position: "i3" },
        a2: null,
        b2: { color: "b", symbol: "b", position: "b2" },
        c2: null,
        d2: null,
        e2: null,
        f2: null,
        g2: null,
        h2: { color: "b", symbol: "r", position: "h2" },
        i2: null,
        a1: { color: "b", symbol: "l", position: "a1" },
        b1: { color: "b", symbol: "n", position: "b1" },
        c1: { color: "b", symbol: "s", position: "c1" },
        d1: { color: "b", symbol: "g", position: "d1" },
        e1: { color: "b", symbol: "k", position: "e1" },
        f1: { color: "b", symbol: "g", position: "f1" },
        g1: { color: "b", symbol: "s", position: "g1" },
        h1: { color: "b", symbol: "n", position: "h1" },
        i1: { color: "b", symbol: "l", position: "i1" },
      };

      const outputFEN = shogiPositionToFEN(shogiPosition);
      expect(outputFEN).to.equal(
        "lnsgkgsnl/1r5b1/ppppppppp/9/9/2P6/PP1PPP1PP/1B5R1/LNSGKGSNL"
      );
    });

    it("should correctly interpret a blank shogi position into a fen string", () => {
      // imagine a blank shogi board
      const shogiPosition: ShogiPosition = {
        a9: null,
        b9: null,
        c9: null,
        d9: null,
        e9: null,
        f9: null,
        g9: null,
        h9: null,
        i9: null,
        a8: null,
        b8: null,
        c8: null,
        d8: null,
        e8: null,
        f8: null,
        g8: null,
        h8: null,
        i8: null,
        a7: null,
        b7: null,
        c7: null,
        d7: null,
        e7: null,
        f7: null,
        g7: null,
        h7: null,
        i7: null,
        a6: null,
        b6: null,
        c6: null,
        d6: null,
        e6: null,
        f6: null,
        g6: null,
        h6: null,
        i6: null,
        a5: null,
        b5: null,
        c5: null,
        d5: null,
        e5: null,
        f5: null,
        g5: null,
        h5: null,
        i5: null,
        a4: null,
        b4: null,
        c4: null,
        d4: null,
        e4: null,
        f4: null,
        g4: null,
        h4: null,
        i4: null,
        a3: null,
        b3: null,
        c3: null,
        d3: null,
        e3: null,
        f3: null,
        g3: null,
        h3: null,
        i3: null,
        a2: null,
        b2: null,
        c2: null,
        d2: null,
        e2: null,
        f2: null,
        g2: null,
        h2: null,
        i2: null,
        a1: null,
        b1: null,
        c1: null,
        d1: null,
        e1: null,
        f1: null,
        g1: null,
        h1: null,
        i1: null,
      };
      const outputFEN = shogiPositionToFEN(shogiPosition);
      expect(outputFEN).to.equal("9/9/9/9/9/9/9/9/9");
    });
  });
});
