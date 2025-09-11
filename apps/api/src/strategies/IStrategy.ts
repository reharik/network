export interface IStrategy<Input, Output> {
  criteria: (input: Input) => boolean;
  execute: (input: Input) => Output;
}
