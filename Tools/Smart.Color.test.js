import { describe, expect,it } from "vitest";
import { Color } from "./Smart.Color.js";

describe("Color", function () {
  describe("parseRGB", function () {
    const parseRGB = Color.parseRGB;

    it("should parse hex codes", function () {
      expect(parseRGB("#000000")).toEqual([0, 0, 0]);
      expect(parseRGB("#FFFFFF")).toEqual([255, 255, 255]);
      expect(parseRGB("#FFFF00")).toEqual([255, 255, 0]);
      expect(parseRGB("#FF0000")).toEqual([255, 0, 0]);
      expect(parseRGB("#0000FF")).toEqual([0, 0, 255]);
    });
    it("should parse valid rgb and rgba colors", function () {
      expect(parseRGB("rgb(255, 255, 255)")).toEqual([255, 255, 255]);
      expect(parseRGB("rgb(0, 0, 0)")).toEqual([0, 0, 0]);
      expect(parseRGB(" rgb ( 0 , 0 , 0 ) ")).toEqual([0, 0, 0]);

      expect(parseRGB("rgba(255, 255, 255, 0)")).toEqual([255, 255, 255, 0]);
      expect(parseRGB("rgba(255, 255, 255, 1)")).toEqual([255, 255, 255, 1]);
      expect(parseRGB("rgba(255, 255, 255, 0.0000)")).toEqual([255, 255, 255, 0]);
      expect(parseRGB("rgba(255, 255, 255, 0.0001)")).toEqual([255, 255, 255, 0.0001]);
      expect(parseRGB("rgba(255, 255, 255, 0.1)")).toEqual([255, 255, 255, 0.1]);
      expect(parseRGB("rgba(255, 255, 255, .1)")).toEqual([255, 255, 255, 0.1]);
      expect(parseRGB("rgba(255, 255, 255, 1.0)")).toEqual([255, 255, 255, 1]);
      expect(parseRGB("rgba(255, 255, 255, 1.0000)")).toEqual([255, 255, 255, 1]);
      expect(parseRGB(" rgba ( 0 , 0 , 0 , 1 ) ")).toEqual([0, 0, 0, 1]);
    });
    it("should not parse extra-invalid rgb() colors", function () {
      // Note: not all rgb colors are validated;
      expect(parseRGB("rgb(9999, 0, 0)")).toEqual(null);
      expect(parseRGB("rgb(0, 0)")).toEqual(null);
      expect(parseRGB("RGB(0, 0, 0)")).toEqual(null);
      expect(parseRGB("rgba(0, 0, 0, 0, 0)")).toEqual(null);

      expect(parseRGB("hsl(0, 0, 0)")).toEqual(null);
      expect(parseRGB("rgb(0, 0%, 0%)")).toEqual(null);
    });
  });
  describe("toRGB", function () {
    const toRGB = Color.toRGB;
    it("should return rgb and rgba colors", function () {
      expect(toRGB([255, 255, 255])).toBe("rgb(255,255,255)");
      expect(toRGB([0, 0, 0])).toBe("rgb(0,0,0)");
      expect(toRGB([0, 0, 255])).toBe("rgb(0,0,255)");
      expect(toRGB([255, 0, 255])).toBe("rgb(255,0,255)");

      expect(toRGB([255, 255, 255, 0])).toBe("rgba(255,255,255,0.00)");
      expect(toRGB([255, 255, 255, 0.001])).toBe("rgba(255,255,255,0.00)");
      expect(toRGB([255, 255, 255, 0.01])).toBe("rgba(255,255,255,0.01)");
      expect(toRGB([255, 255, 255, 0.1])).toBe("rgba(255,255,255,0.10)");
      expect(toRGB([255, 255, 255, 0.99])).toBe("rgba(255,255,255,0.99)");
      expect(toRGB([255, 255, 255, 0.999])).toBe("rgba(255,255,255,1.00)");
    });
    it("should validate and cap the values", function () {
      expect(toRGB([256, 300, 9999999])).toBe("rgb(255,255,255)");
      expect(toRGB([-1, -300, -999999])).toBe("rgb(0,0,0)");

      expect(toRGB([256, 256, 256, 1.1])).toBe("rgba(255,255,255,1.00)");
      expect(toRGB([-1, -1, -1, -1])).toBe("rgba(0,0,0,0.00)");
    });
  });
  describe("parseHSL", function () {
    const parseHSL = Color.parseHSL;
    it("should parse hsl and hsla colors", function () {
      expect(parseHSL("hsl(0, 0%, 0%)")).toEqual([0, 0, 0]);
      expect(parseHSL(" hsl ( 0 , 0 % , 0 % ) ")).toEqual([0, 0, 0]);
      expect(parseHSL("hsl(359, 100%, 100%)")).toEqual([359, 100, 100]);
      expect(parseHSL("hsl(999, 100%, 100%)")).toEqual([999, 100, 100]);

      expect(parseHSL("hsla(0, 0%, 0%, 0)")).toEqual([0, 0, 0, 0]);
      expect(parseHSL("hsla(0, 0%, 0%, 1)")).toEqual([0, 0, 0, 1]);
      expect(parseHSL("hsla(0, 0%, 0%, 0.999)")).toEqual([0, 0, 0, 0.999]);
    });
    it("shouldn't parse really invalid hsl colors", function () {
      expect(parseHSL("hsl(0, 0, 0)")).toBe(null);
      expect(parseHSL("hsl(0, 0%, 0)")).toBe(null);
      expect(parseHSL("hsl(0, 0, 0%)")).toBe(null);
      expect(parseHSL("hsl(0%, 0%, 0%)")).toBe(null);
      expect(parseHSL("HSL(0, 0%, 0%)")).toBe(null);
      expect(parseHSL("hsla(0, 0%, 0%, 0%)")).toBe(null);
      expect(parseHSL("hsla(0, 0%, 0%, 100%)")).toBe(null);
      expect(parseHSL("hsla(0, 0, 0, 0)")).toBe(null);
    });
  });
  describe("toHSL", function () {
    const toHSL = Color.toHSL;
    it("should output hsl and hsla colors", function () {
      expect(toHSL([0, 0, 0])).toBe("hsl(0,0%,0%)");
      expect(toHSL([359, 100, 100])).toBe("hsl(359,100%,100%)");

      expect(toHSL([0, 0, 0, 0])).toBe("hsla(0,0%,0%,0.00)");
      expect(toHSL([0, 0, 0, 0.001])).toBe("hsla(0,0%,0%,0.00)");
      expect(toHSL([0, 0, 0, 0.01])).toBe("hsla(0,0%,0%,0.01)");
      expect(toHSL([0, 0, 0, 0.1])).toBe("hsla(0,0%,0%,0.10)");
      expect(toHSL([0, 0, 0, 0.99])).toBe("hsla(0,0%,0%,0.99)");
      expect(toHSL([0, 0, 0, 0.999])).toBe("hsla(0,0%,0%,1.00)");
    });
    it("should validate and cap values", function () {
      expect(toHSL([361, 200, 200])).toBe("hsl(1,100%,100%)");
      expect(toHSL([-1, -1, -1])).toBe("hsl(359,0%,0%)");

      expect(toHSL([361, 200, 200, 5])).toBe("hsla(1,100%,100%,1.00)");
      expect(toHSL([-361, -1, -1, -1])).toBe("hsla(359,0%,0%,0.00)");
    });
  });
});
