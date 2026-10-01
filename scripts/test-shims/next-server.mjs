export function after(task) {
  if (typeof task === "function") {
    void task();
  }
}

export class NextRequest {}

export class NextResponse {
  static next(init) {
    return {
      init,
      cookies: {
        values: [],
        set(name, value, options) {
          this.values.push({ name, value, options });
        },
        delete() {},
      },
    };
  }

  static json(data, init) {
    return { data, init, cookies: { set() {}, delete() {} } };
  }
}
