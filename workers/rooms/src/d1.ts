// The parts of D1's binding this code uses. The full runtime types redeclare
// the globals the site's browser code shares (see types/cloudflare-workers.d.ts).

export interface D1Result<T = Record<string, unknown>> {
  results: T[]
  meta: { changes: number }
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>
  first<T = Record<string, unknown>>(): Promise<T | null>
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement
  /** Runs the statements in one transaction: all of them apply, or none. */
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>
}
