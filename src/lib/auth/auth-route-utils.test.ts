import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAttributionIdentityHeaders,
  scheduleAttributionIdentity,
} from "./auth-route-utils";

const VISITOR_ID = "11111111-1111-4111-8111-111111111111";

test("identity scheduling uses one retry and does not throw when the sender fails", async () => {
  let scheduledTask: (() => unknown | Promise<unknown>) | undefined;
  let sentRetries: number | undefined;

  const scheduled = scheduleAttributionIdentity(
    VISITOR_ID,
    { accessToken: "fresh-access-token" },
    [],
    {
      schedule: (task) => {
        scheduledTask =
          typeof task === "function" ? task : () => task;
      },
      sendIdentity: async (_visitorId, options) => {
        sentRetries = options?.retries;
        return false;
      },
    },
  );

  assert.equal(scheduled, true);
  await scheduledTask?.();
  assert.equal(sentRetries, 1);
});

test("refresh recovery can build Authorization from a fresh access token in response body", () => {
  const headers = buildAttributionIdentityHeaders(
    {
      data: {
        accessToken: "fresh-access-token",
        refreshToken: "refresh-token",
        deviceId: "device-id",
      },
    },
    [],
  );

  assert.equal(headers.Authorization, "Bearer fresh-access-token");
  assert.equal(headers.Cookie, undefined);
});

test("refresh recovery can build Authorization from a fresh access token Set-Cookie", () => {
  const headers = buildAttributionIdentityHeaders({}, [
    "CUP_Customer_Access_Token=fresh-cookie-token; Path=/; HttpOnly",
    "CUP_Customer_Refresh_Token=refresh-token; Path=/; HttpOnly",
    "CUP_Customer_Device_Id=device-id; Path=/; HttpOnly",
  ]);

  assert.equal(headers.Authorization, "Bearer fresh-cookie-token");
  assert.equal(headers.Cookie, undefined);
});

test("identity scheduling skips missing or invalid visitor ids", () => {
  let scheduleCalls = 0;
  const schedule = () => {
    scheduleCalls++;
  };

  assert.equal(
    scheduleAttributionIdentity(undefined, { accessToken: "token" }, [], {
      schedule,
    }),
    false,
  );
  assert.equal(
    scheduleAttributionIdentity("invalid", { accessToken: "token" }, [], {
      schedule,
    }),
    false,
  );
  assert.equal(scheduleCalls, 0);
});
