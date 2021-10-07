import { setupDuckDBSync } from './setup';
import {
    ArqueroIntegerJoin2Benchmark,
    DuckDBSyncIntegerJoin2Benchmark,
    SystemBenchmark,
    SystemBenchmarkContext,
} from './system';
import { runSystemBenchmarks } from './suite';
import path from 'path';
import fs from 'fs/promises';

async function main() {
    const duckdbDB = await setupDuckDBSync();

    const ctx: SystemBenchmarkContext = {
        seed: Math.random(),
    };
    const suite: SystemBenchmark[] = [
        new DuckDBSyncIntegerJoin2Benchmark(duckdbDB, 1000, 10000, 100, 10),
        new DuckDBSyncIntegerJoin2Benchmark(duckdbDB, 10000, 100000, 100, 10),
        new DuckDBSyncIntegerJoin2Benchmark(duckdbDB, 100000, 100000, 100, 10),
        new DuckDBSyncIntegerJoin2Benchmark(duckdbDB, 100000, 1000000, 100, 10),
        new ArqueroIntegerJoin2Benchmark(1000, 10000, 100, 10),
        new ArqueroIntegerJoin2Benchmark(10000, 100000, 100, 10),
        new ArqueroIntegerJoin2Benchmark(100000, 100000, 100, 10),
        new ArqueroIntegerJoin2Benchmark(100000, 1000000, 100, 10),
    ];
    const results = await runSystemBenchmarks(ctx, suite);

    // Write results
    const reports = path.resolve(__dirname, '../../../reports');
    await fs.mkdir(reports);
    await fs.writeFile(path.resolve(reports, './benchmark_system_join_2.json'), JSON.stringify(results), 'utf8');
}

main();