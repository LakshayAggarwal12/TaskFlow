jest.mock("../../models/List");
jest.mock("../../models/Task");
jest.mock("../../socket/emit");
jest.mock("../../utils/logActivity");

const { emitToBoard } = require("../../socket/emit");
const { updateList } = require("../listController");

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
// asyncHandler doesn't return its promise, so wait for a response (or error).
const run = (req) =>
  new Promise((resolve, reject) => {
    const res = makeRes();
    res.json.mockImplementation(() => {
      resolve(res);
      return res;
    });
    updateList(req, res, (err) => reject(err || new Error("next() without response")));
  });

const makeReq = (role, body) => ({
  body,
  effectiveRole: role,
  board: { _id: "b1" },
  list: { name: "To Do", isDoneList: false, save: jest.fn().mockResolvedValue() },
});

describe("updateList", () => {
  test("a member can still rename a list", async () => {
    const req = makeReq("member", { name: "Backlog" });
    const res = await run(req);
    expect(req.list.name).toBe("Backlog");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(emitToBoard).toHaveBeenCalledWith("b1", "list:updated", expect.anything());
  });

  test("an admin can mark a list as Done", async () => {
    const req = makeReq("admin", { isDoneList: true });
    await run(req);
    expect(req.list.isDoneList).toBe(true);
    expect(req.list.save).toHaveBeenCalled();
  });

  test("a member cannot change isDoneList — otherwise they could bypass the review gate", async () => {
    const req = makeReq("member", { isDoneList: true });
    const res = await run(req);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(req.list.isDoneList).toBe(false);
    expect(req.list.save).not.toHaveBeenCalled();
  });

  test("a member's rename is NOT silently applied when the same request tries isDoneList", async () => {
    const req = makeReq("member", { name: "Sneaky", isDoneList: true });
    await run(req);
    expect(req.list.name).toBe("To Do");
    expect(req.list.save).not.toHaveBeenCalled();
  });

  test("rejects a non-boolean isDoneList", async () => {
    const req = makeReq("owner", { isDoneList: "yes" });
    const res = await run(req);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(req.list.save).not.toHaveBeenCalled();
  });

  test("an admin can unmark a Done list", async () => {
    const req = makeReq("owner", { isDoneList: false });
    req.list.isDoneList = true;
    await run(req);
    expect(req.list.isDoneList).toBe(false);
  });
});