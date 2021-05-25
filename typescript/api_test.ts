import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

export enum Error {
  UserNotFound = "not_found",
  ErrNotImplemented = "not_implemented",
}

type User = {
  Id: string;
  Email?: string;
  FullName?: string;
};

type UpdateUserRequest = {
  Id: string;
  FullName?: string;
  Email?: string;
};

class UserApi {
  constructor(public storage: User[]) {}

  update(request: UpdateUserRequest) {
    const index = this.storage.findIndex((user) => user.Id === request.Id);
    if (index === -1) {
      return Error.UserNotFound;
    }
    const user = this.storage[index];
    for (const [k, v] of Object.entries(request)) {
      //@ts-ignore
      user[k] = v;
    }

    return user;
  }
}

type ApiTestCase = {
  users: User[];
  input: UpdateUserRequest;
  output?: User;
  err?: string;
};
const testCases: ApiTestCase[] = [
  {
    users: [
      {
        Id: "6a43df",
        FullName: "Tom Jefferson",
        Email: "jefferson999@mirro.com",
      },
    ],
    input: { Id: "6a43df", Email: "t.jefferson@mirro.com" },
    output: {
      Id: "6a43df",
      FullName: "Tom Jefferson",
      Email: "t.jefferson@mirro.com",
    },
  },
  {
    users: [
      {
        Id: "56781a",
        FullName: "Eric Nilsson",
        Email: "eric_fantastic@offtop.com",
      },
    ],
    input: { Id: "56781c", FullName: "Eric Fantastic" },
    err: Error.UserNotFound,
  },
  {
    users: [
      {
        Id: "556f36",
        FullName: "Antony Downtown",
        Email: "antony.downtown@gmail.com",
      },
    ],
    input: { Id: "556f37", FullName: "Antony Uptown" },
    err: Error.UserNotFound,
  },
  {
    users: [{ Id: "34d35", FullName: "Mickle Now", Email: "m.n@story.com" }],
    input: { Id: "34d35" },
    output: { Id: "34d35", FullName: "Mickle Now", Email: "m.n@story.com" },
  },
  {
    users: [],
    input: { Id: "34d35", FullName: "Nina Mitk", Email: "m.n@story.com" },
    err: Error.UserNotFound,
  },
];

testCases.forEach((test, i) => {
  Deno.test(`Position: ${i} failed`, () => {
    const userApi = new UserApi(test.users);
    const updated = userApi.update(test.input as UpdateUserRequest);
    if (!test.err && test.output) {
      assertObjectMatch(test.output, updated as User);
      assertObjectMatch(test.output, userApi.storage[0]);
    } else if (test.err) {
      assertEquals(test.err, updated);
    }
  });
});
