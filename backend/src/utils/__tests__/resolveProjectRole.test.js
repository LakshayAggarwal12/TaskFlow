jest.mock("../../models/Project");
jest.mock("../../models/Workspace");

const Project = require("../../models/Project");
const Workspace = require("../../models/Workspace");
const resolveProjectRole = require("../resolveProjectRole");

// Models are mocked so this test needs no real database connection — it
// verifies the permission-chain logic in isolation, which is the part of
// this function actually worth protecting with a test.
const makeProject = (overrides = {}) => ({
  archived: false,
  workspace: "workspace-1",
  getOverrideRole: jest.fn().mockReturnValue(null),
  ...overrides,
});

const makeWorkspace = (role) => ({
  getMemberRole: jest.fn().mockReturnValue(role),
});

beforeEach(() => jest.clearAllMocks());

describe("resolveProjectRole", () => {
  test("throws 404 when the project doesn't exist", async () => {
    Project.findById.mockResolvedValue(null);
    await expect(resolveProjectRole("p1", "u1")).rejects.toMatchObject({ status: 404 });
  });

  test("throws 404 when the project is archived", async () => {
    Project.findById.mockResolvedValue(makeProject({ archived: true }));
    await expect(resolveProjectRole("p1", "u1")).rejects.toMatchObject({ status: 404 });
  });

  test("throws 403 when the user isn't a member of the parent workspace", async () => {
    Project.findById.mockResolvedValue(makeProject());
    Workspace.findById.mockResolvedValue(makeWorkspace(null));
    await expect(resolveProjectRole("p1", "u1")).rejects.toMatchObject({ status: 403 });
  });

  test("owner/admin roles pass through unchanged, ignoring any project override", async () => {
    const project = makeProject();
    Project.findById.mockResolvedValue(project);
    Workspace.findById.mockResolvedValue(makeWorkspace("admin"));

    const { effectiveRole } = await resolveProjectRole("p1", "u1");
    expect(effectiveRole).toBe("admin");
    expect(project.getOverrideRole).not.toHaveBeenCalled();
  });

  test("a workspace 'member' gets bumped by a project-level override role", async () => {
    const project = makeProject({ getOverrideRole: jest.fn().mockReturnValue("admin") });
    Project.findById.mockResolvedValue(project);
    Workspace.findById.mockResolvedValue(makeWorkspace("member"));

    const { effectiveRole } = await resolveProjectRole("p1", "u1");
    expect(effectiveRole).toBe("admin");
  });

  test("a workspace 'member' with no override keeps the base role", async () => {
    Project.findById.mockResolvedValue(makeProject());
    Workspace.findById.mockResolvedValue(makeWorkspace("member"));

    const { effectiveRole } = await resolveProjectRole("p1", "u1");
    expect(effectiveRole).toBe("member");
  });

  test("a 'viewer' can also be bumped by an override, same as 'member'", async () => {
    const project = makeProject({ getOverrideRole: jest.fn().mockReturnValue("member") });
    Project.findById.mockResolvedValue(project);
    Workspace.findById.mockResolvedValue(makeWorkspace("viewer"));

    const { effectiveRole } = await resolveProjectRole("p1", "u1");
    expect(effectiveRole).toBe("member");
  });
});