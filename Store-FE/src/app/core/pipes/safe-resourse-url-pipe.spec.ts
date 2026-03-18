import { SafeResourseUrlPipe } from "./safe-resourse-url-pipe";

describe("SafeResourseUrlPipe", () => {
  it("create an instance", () => {
    const pipe = new SafeResourseUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
