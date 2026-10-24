jest.mock("../../models/Task");
jest.mock("../../models/List");
jest.mock("../../models/Board");
jest.mock("../../models/Project");

const Task = require("../../models/Task");
const List = require("../../models/List");
const Board = require("../../models/Board");
const Project = require("../../models/Project");
const { composeLink, resolveNotificationLink } = require("../notificationLink");

describe("composeLink", () => {
  test("deep-links to a task on its board", () => {
    expect(composeLink({ clientUrl: "https://app.test/", workspaceId: "w", projectId: "p", boardId: "b", taskId: "t" })).toBe(
      "https://app.test/w/w/p/p/board/b?task=t"
    );
  });

  test("falls back progressively: board, project, then workspaces", () => {
    expect(composeLink({ clientUrl: "https://a.test", workspaceId: "w", projectId: "p", boardId: "b" })).toBe("https://a.test/w/w/p/p/board/b");
    expect(composeLink({ clientUrl: "https://a.test", workspaceId: "w", projectId: "p" })).toBe("https://a.test/w/w/p/p");
    expect(composeLink({ clientUrl: "https://a.test" })).toBe("https://a.test/workspaces");
  });

  test("defaults to localhost when CLIENT_URL is unset", () => {
    expect(composeLink({})).toBe("http://localhost:5173/workspaces");
  });
});

describe("resolveNotificationLink", () => {
  beforeEach(() => jest.clearAllMocks());

  test("walks task -> list -> board -> project to build a deep link", async () => {
    Task.findById.mockResolvedValue({ _id: "t", list: "l" });
    List.findById.mockResolvedValue({ board: "b" });
    Board.findById.mockResolvedValue({ _id: "b", project: "p" });
    Project.findById.mockResolvedValue({ _id: "p", workspace: "w" });
    const link = await resolveNotificationLink({ relatedTask: "t" });
    expect(link).toMatch(/\/w\/w\/p\/p\/board\/b\?task=t$/);
  });

  test("uses the project link when there is no task", async () => {
    Project.findById.mockResolvedValue({ _id: "p", workspace: "w" });
    expect(await resolveNotificationLink({ relatedProject: "p" })).toMatch(/\/w\/w\/p\/p$/);
  });

  test("never throws — a lookup failure degrades to the generic link", async () => {
    Task.findById.mockRejectedValue(new Error("db down"));
    expect(await resolveNotificationLink({ relatedTask: "t" })).toMatch(/\/workspaces$/);
  });
});