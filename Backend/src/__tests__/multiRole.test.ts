// Exercises the frontend role-cookie logic that the middleware edge-guard reads.
// A stale token from a previously-used role must not override the role the user
// actually logged in as (issue #8). Runs in Node with hand-rolled window/document
// fakes so no jsdom dependency is needed.
import { setRoleCookie, syncRoleCookie, ROLE_COOKIE } from "../../../lib/auth-cookie";
import { STORAGE_KEYS } from "../../../lib/api/config";

function makeLocalStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
    removeItem: (k: string) => {
      delete store[k];
    },
  };
}

let cookieJar: Record<string, string> = {};
const fakeDocument = {
  get cookie() {
    return Object.entries(cookieJar)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  },
  set cookie(str: string) {
    const [pair] = str.split(";");
    const [k, v] = pair.split("=");
    const key = k.trim();
    if (/max-age=0/.test(str)) delete cookieJar[key];
    else cookieJar[key] = (v ?? "").trim();
  },
};

const getRoleCookie = () => cookieJar[ROLE_COOKIE];

beforeEach(() => {
  cookieJar = {};
  (global as any).window = { localStorage: makeLocalStorage() };
  (global as any).document = fakeDocument;
});

afterEach(() => {
  delete (global as any).window;
  delete (global as any).document;
});

describe("multi-role token isolation (#8)", () => {
  it("a fresh USER login purges a stale admin token and is not misrouted", () => {
    const ls = (global as any).window.localStorage;

    // Stale admin session left over in localStorage
    ls.setItem(STORAGE_KEYS.ADMIN_TOKEN, "old-admin-jwt");

    // User logs in as USER
    ls.setItem(STORAGE_KEYS.USER_TOKEN, "user-jwt");
    setRoleCookie("USER");

    // The stale admin token is purged and the cookie reflects USER, not ADMIN
    expect(ls.getItem(STORAGE_KEYS.ADMIN_TOKEN)).toBeNull();
    expect(getRoleCookie()).toBe("USER");

    // A later passive sync must NOT flip it back to ADMIN
    syncRoleCookie();
    expect(getRoleCookie()).toBe("USER");
  });

  it("syncRoleCookie prefers the recorded active role over stale token precedence", () => {
    const ls = (global as any).window.localStorage;

    // User is the active, logged-in role
    ls.setItem(STORAGE_KEYS.USER_TOKEN, "user-jwt");
    ls.setItem("cn_active_role", "USER");

    // A stale higher-precedence token appears (e.g. an old restaurant session)
    ls.setItem(STORAGE_KEYS.RESTAURANT_TOKEN, "stale-restaurant-jwt");

    syncRoleCookie();
    expect(getRoleCookie()).toBe("USER");
  });

  it("falls back to the single present token for legacy sessions", () => {
    const ls = (global as any).window.localStorage;
    ls.setItem(STORAGE_KEYS.RIDER_TOKEN, "rider-jwt");

    syncRoleCookie();
    expect(getRoleCookie()).toBe("RIDER");
  });
});
