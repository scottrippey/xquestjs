import { describe, expect,it } from "vitest";
import { Interpolate } from "./Smart.Interpolate.js";

describe("Smart.Interpolate", function () {
  describe("Smart.Interpolate.numbers", function () {
    const interpolateNumbers = Interpolate.numbers;
    const interpolate = interpolateNumbers(100, 200);

    it("should return a function that accepts 1 parameter", function () {
      expect(typeof interpolate).toBe("function");
      expect(interpolate.length).toBe(1);
    });

    it("should interpolate between positive values", function () {
      expect([0.0, 0.25, 0.5, 0.75, 1.0].map(interpolate)).toEqual([100, 125, 150, 175, 200]);
    });

    const interpolateNeg = interpolateNumbers(-200, -100);
    it("should interpolate between negative values", function () {
      expect([0.0, 0.25, 0.5, 0.75, 1.0].map(interpolateNeg)).toEqual([
        -200, -175, -150, -125, -100,
      ]);
    });

    const interpolateDown = interpolateNumbers(200, 100);
    it("should interpolate from high to low", function () {
      expect([0.0, 0.25, 0.5, 0.75, 1.0].map(interpolateDown)).toEqual([200, 175, 150, 125, 100]);
    });

    it("should EXTRAPOLATE when given high and low pct", function () {
      expect([-1, -0.25, 0.5, 1.25, 2].map(interpolate)).toEqual([0, 75, 150, 225, 300]);
    });
  });
  describe("Smart.Interpolate.colors", function () {
    const interpolateColors = Interpolate.colors;
    const interpolate = interpolateColors("rgb(100, 110, 120)", "rgb(200, 210, 220)");

    it("should interpolate between colors", function () {
      expect([0, 0.25, 0.5, 0.75, 1].map(interpolate)).toEqual([
        "rgb(100,110,120)",
        "rgb(125,135,145)",
        "rgb(150,160,170)",
        "rgb(175,185,195)",
        "rgb(200,210,220)",
      ]);
    });
    const interpolateCap = interpolateColors("rgb(100,100,100)", "rgb(200,200,200)");
    it("should validate and cap values", function () {
      expect([-2, -1, -0.25, -0.1, 1.1, 1.5, 2].map(interpolateCap)).toEqual([
        "rgb(0,0,0)",
        "rgb(0,0,0)",
        "rgb(75,75,75)",
        "rgb(90,90,90)",
        "rgb(210,210,210)",
        "rgb(250,250,250)",
        "rgb(255,255,255)",
      ]);
    });

    const interpolateAlpha = interpolateColors("rgba(0,0,0,0.1)", "rgba(0,0,0,0.2)");
    it("should interpolate alphas", function () {
      expect([-1, -0.1, 0, 0.1, 0.5, 0.9, 1, 2].map(interpolateAlpha)).toEqual([
        "rgba(0,0,0,0.00)",
        "rgba(0,0,0,0.09)",
        "rgba(0,0,0,0.10)",
        "rgba(0,0,0,0.11)",
        "rgba(0,0,0,0.15)",
        "rgba(0,0,0,0.19)",
        "rgba(0,0,0,0.20)",
        "rgba(0,0,0,0.30)",
      ]);
    });

    const interpolateHSL = interpolateColors("hsl(10, 20%, 30%)", "hsl(20, 30%, 40%)");
    it("should interpolate and cap hsl values too", function () {
      expect([-100, -2, -1, -0.1, 0, 0.1, 0.5, 0.9, 1, 1.1, 2, 100].map(interpolateHSL)).toEqual([
        "hsl(90,0%,0%)",
        "hsl(350,0%,10%)",
        "hsl(0,10%,20%)",
        "hsl(9,19%,29%)",
        "hsl(10,20%,30%)",
        "hsl(11,21%,31%)",
        "hsl(15,25%,35%)",
        "hsl(19,29%,39%)",
        "hsl(20,30%,40%)",
        "hsl(21,31%,41%)",
        "hsl(30,40%,50%)",
        "hsl(290,100%,100%)",
      ]);
    });
    const interpolateHSLA = interpolateColors("hsla(0,0%,0%,0.1)", "hsla(0,0%,0%,0.2)");
    it("should interpolate hsla", function () {
      expect([-100, -1, 0, 0.5, 1, 2, 100].map(interpolateHSLA)).toEqual([
        "hsla(0,0%,0%,0.00)",
        "hsla(0,0%,0%,0.00)",
        "hsla(0,0%,0%,0.10)",
        "hsla(0,0%,0%,0.15)",
        "hsla(0,0%,0%,0.20)",
        "hsla(0,0%,0%,0.30)",
        "hsla(0,0%,0%,1.00)",
      ]);
    });
  });
});
