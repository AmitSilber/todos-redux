import { Injectable } from '@nestjs/common';
import { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class ConnectionService {
  private pool: Pool = new Pool({
    connectionString: 'postgresql://localhost:5432/todos',
  });

  getPoolConnection(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: I,
  ): Promise<QueryResult<R>> {
    return this.pool.query(queryTextOrConfig, values).catch((err) => {
      throw err;
    });
  }
}
