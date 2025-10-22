import { assertEquals } from "std/assert/mod.ts";
import { isValidHighScore } from "./validate-high-score.ts";

Deno.test("isValidHighScore - valid data", () => {
  const validData = {
    user_id: "user123",
    score: 1000,
  };

  assertEquals(isValidHighScore(validData), true);
});

Deno.test("isValidHighScore - invalid user_id", () => {
  const invalidData = {
    user_id: "",
    score: 1000,
  };

  assertEquals(isValidHighScore(invalidData), false);
});

Deno.test("isValidHighScore - invalid score", () => {
  const invalidData = {
    user_id: "user123",
    score: -100,
  };

  assertEquals(isValidHighScore(invalidData), false);
});

Deno.test("isValidHighScore - null data", () => {
  assertEquals(isValidHighScore(null), false);
});

Deno.test("isValidHighScore - wrong types", () => {
  const invalidData = {
    user_id: 123,
    score: "not-a-number",
  };

  assertEquals(isValidHighScore(invalidData), false);
});
