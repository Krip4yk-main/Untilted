import { HasRequiredValidatorPipe } from "./has-required-validator-pipe";

describe("HasRequiredValidatorPipe", () => {
  it("create an instance", () => {
    const pipe = new HasRequiredValidatorPipe();
    expect(pipe).toBeTruthy();
  });
});
