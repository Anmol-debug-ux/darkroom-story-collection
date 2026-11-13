import { renderHook, act } from "@testing-library/react";
import { expect, it } from "vitest";
import { ChatSession, useChatSession } from "./chat-session";

it("keeps separate temporary conversations without persistence after a new session", () => {
  const first = renderHook(() => useChatSession(), { wrapper: ChatSession });
  act(() => {
    first.result.current.update({
      id: "one",
      title: "First",
      messages: [{ id: "a", role: "user", parts: [{ type: "text", text: "Apples" }] }],
    });
    first.result.current.update({
      id: "two",
      title: "Second",
      messages: [{ id: "b", role: "user", parts: [{ type: "text", text: "Oranges" }] }],
    });
  });
  expect(first.result.current.threads.map((t) => t.messages[0]?.parts)).toEqual([
    [{ type: "text", text: "Apples" }],
    [{ type: "text", text: "Oranges" }],
  ]);
  first.unmount();
  const fresh = renderHook(() => useChatSession(), { wrapper: ChatSession });
  expect(fresh.result.current.threads).toEqual([]);
});
