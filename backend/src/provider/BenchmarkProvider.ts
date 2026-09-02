export interface BenchmarkProvider {
  getNiftyValue(): Promise<number>;
}