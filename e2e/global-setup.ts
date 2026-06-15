import { rm } from "fs/promises";

export default async function globalSetup() {
  // Fresh DB for each test run
  await rm("/tmp/pool-tracker-test.db", { force: true });
  await rm("/tmp/pool-tracker-test.db-shm", { force: true });
  await rm("/tmp/pool-tracker-test.db-wal", { force: true });
}
