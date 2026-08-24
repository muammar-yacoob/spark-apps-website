/**
 * How a tool answers.
 *
 * MCP content is text, so every result here is JSON serialised into one text
 * block. Errors go back the same way rather than as thrown exceptions: a tool
 * that throws reaches the client as a protocol failure, which reads as "the
 * server is broken" when the truth is usually "no app by that id".
 *
 * Kept identical to the same file in the sibling Spark apps, so a tool result
 * looks the same whichever server in the portfolio answered.
 */
export function jsonContent(payload: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
  };
}

/** A failure the model should read and relay, not retry blindly. */
export function errorContent(error: string, extra?: Record<string, unknown>) {
  return jsonContent({ error, ...extra });
}
