jest.mock("../../models/User");
jest.mock("../../models/Workspace");
jest.mock("../../models/Project");

const User = require("../../models/User");
const { addMember } = require("../workspaceController");

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
    addMember(req, res, (err) => reject(err || new Error("next() without response")));
  });

const makeReq = (body) => ({
  body,
  workspace: { members: [], save: jest.fn().mockResolvedValue() },
});

beforeEach(() => {
  jest.clearAllMocks();
  User.findOne.mockResolvedValue({ _id: "u2" });
});

describe("addMember", () => {
  test("rejects role 'owner' — an admin must not be able to mint a second owner", async () => {
    const req = makeReq({ email: "x@y.com", role: "owner" });
    const res = await run(req);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(req.workspace.members).toHaveLength(0);
    expect(req.workspace.save).not.toHaveBeenCalled();
  });

  test("rejects any unknown role", async () => {
    const res = await run(makeReq({ email: "x@y.com", role: "superuser" }));
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("defaults to 'member' when no role is given", async () => {
    const req = makeReq({ email: "x@y.com" });
    await run(req);
    expect(req.workspace.members).toEqual([{ user: "u2", role: "member" }]);
  });

  test.each(["admin", "member", "viewer"])("accepts role '%s'", async (role) => {
    const req = makeReq({ email: "x@y.com", role });
    const res = await run(req);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(req.workspace.members[0].role).toBe(role);
  });

  test("still requires an email", async () => {
    const res = await run(makeReq({ role: "member" }));
    expect(res.status).toHaveBeenCalledWith(400);
  });
});