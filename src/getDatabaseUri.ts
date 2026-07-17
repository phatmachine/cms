import type { MongoMemoryReplSet } from 'mongodb-memory-server'

/**
 * Resolves the MongoDB connection. Uses DATABASE_URI when set (e.g. in production).
 * Otherwise spins up an in-memory MongoDB replica set for local development so no local
 * MongoDB/Docker install is required. A replica set (not a single server) is required so
 * that Payload's transactions work.
 */
export async function getDatabaseUri(): Promise<{
  mongoMemoryServer?: MongoMemoryReplSet
  url: string
}> {
  if (process.env.DATABASE_URI) {
    return { url: process.env.DATABASE_URI }
  }

  const { MongoMemoryReplSet } = await import('mongodb-memory-server')
  const mongoMemoryServer = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  })

  return {
    mongoMemoryServer,
    url: mongoMemoryServer.getUri('cms'),
  }
}
