import { assertEquals } from "std/assert/mod.ts";
import { HighScoreRequest, isValidHighScore } from "./index.ts";

/**
 * Tests that the isValidHighScore function returns true for valid high score data
 */
Deno.test("isValidHighScore - valid data", () => {
  const validData: HighScoreRequest = {
    initials: "ABC",
    score: 1000,
  };
  assertEquals(isValidHighScore(validData), true);
});

/**
 * Tests that the isValidHighScore function returns false for invalid high score data
 */
Deno.test("isValidHighScore - invalid initials (too short)", () => {
  const invalidData = {
    initials: "AB",
    score: 1000,
  };

  assertEquals(isValidHighScore(invalidData), false);
});

/**
 * Tests that the isValidHighScore function returns false for invalid high score data
 */
Deno.test("isValidHighScore - invalid initials (non-alphanumeric)", () => {
  const invalidData = {
    initials: "AB!",
    score: 1000,
  };

  assertEquals(isValidHighScore(invalidData), false);
});

/**
 * Tests that the isValidHighScore function returns false for invalid high score data
 */
Deno.test("isValidHighScore - invalid score (negative)", () => {
  const invalidData = {
    initials: "ABC",
    score: -100,
  };

  assertEquals(isValidHighScore(invalidData), false);
});

/**
 * Tests that the isValidHighScore function returns false for invalid high score data
 */
Deno.test("isValidHighScore - invalid score (non-integer)", () => {
  const invalidData = {
    initials: "ABC",
    score: 1000.5,
  };

  assertEquals(isValidHighScore(invalidData), false);
});
