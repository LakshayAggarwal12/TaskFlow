const { canEnterDoneList, nextReviewStatusAfterMove } = require("../submissionGate");

describe("canEnterDoneList", () => {
  test("only 'approved' passes the gate", () => {
    expect(canEnterDoneList("approved")).toBe(true);
    expect(canEnterDoneList("none")).toBe(false);
    expect(canEnterDoneList("pending_review")).toBe(false);
    expect(canEnterDoneList("changes_requested")).toBe(false);
  });
});

describe("nextReviewStatusAfterMove", () => {
  test("reopening a task (Done -> not Done) resets review status to 'none'", () => {
    expect(
      nextReviewStatusAfterMove({ reviewStatus: "approved", sourceIsDone: true, targetIsDone: false })
    ).toBe("none");
  });

  test("moving between two non-Done lists leaves review status untouched", () => {
    expect(
      nextReviewStatusAfterMove({ reviewStatus: "pending_review", sourceIsDone: false, targetIsDone: false })
    ).toBe("pending_review");
  });

  test("moving between two Done lists leaves review status untouched", () => {
    expect(
      nextReviewStatusAfterMove({ reviewStatus: "approved", sourceIsDone: true, targetIsDone: true })
    ).toBe("approved");
  });

  test("moving into a Done list doesn't itself change status (gating happens separately)", () => {
    expect(
      nextReviewStatusAfterMove({ reviewStatus: "approved", sourceIsDone: false, targetIsDone: true })
    ).toBe("approved");
  });
});