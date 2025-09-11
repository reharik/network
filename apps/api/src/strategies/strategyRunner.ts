import { IStrategy } from './IStrategy';

interface IStrategyRunner<INPUT, OUTPUT> {
  execute: (input: INPUT) => OUTPUT;
}

/**
 * Factory function to create all smart enum strategy runner
 * This can be used with Awilix to inject all strategies
 */
export const createStrategyRunner = <INPUT, OUTPUT>(
  strategies: IStrategy<INPUT, OUTPUT>[],
): IStrategyRunner<INPUT, OUTPUT> => {
  const execute = (input: INPUT) => {
    const strategy = strategies.find((s) => s.criteria(input));
    if (!strategy) {
      throw new Error('No strategy found for input');
    }
    return strategy.execute(input);
  };

  return {
    execute,
  };
};
