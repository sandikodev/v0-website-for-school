import { Prisma } from "@prisma/client";

/**
 * Prisma Query Logger
 * 
 * Logs all database queries with performance metrics
 * Useful for debugging and monitoring tenant-specific queries
 */

interface QueryLog {
  model: string;
  action: string;
  duration: number;
  tenantId?: string;
  timestamp: Date;
}

const queryLogs: QueryLog[] = [];
const MAX_LOGS = 1000; // Keep last 1000 queries

/**
 * Apply query logging extension to Prisma client
 */
export function getQueryLoggingExtension() {
  return Prisma.defineExtension((client) => {
    return client.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const before = Date.now();

            try {
              const result = await query(args);
              const after = Date.now();
              const duration = after - before;

              // Log query
              const log: QueryLog = {
                model: model || "unknown",
                action: operation,
                duration,
                timestamp: new Date(),
              };

              // Add to logs
              queryLogs.push(log);

              // Keep only last MAX_LOGS
              if (queryLogs.length > MAX_LOGS) {
                queryLogs.shift();
              }

              // Console log for development
              if (process.env.NODE_ENV === "development") {
                console.log(
                  `[Prisma] ${model}.${operation} - ${duration}ms`
                );
              }

              // Warn on slow queries (> 1000ms)
              if (duration > 1000) {
                console.warn(
                  `[Prisma] SLOW QUERY: ${model}.${operation} took ${duration}ms`,
                  { params: args }
                );
              }

              return result;
            } catch (error) {
              const after = Date.now();
              const duration = after - before;

              console.error(
                `[Prisma] ERROR: ${model}.${operation} failed after ${duration}ms`,
                { error }
              );

              throw error;
            }
          },
        },
      },
    });
  });
}

/**
 * Get query logs for analysis
 */
export function getQueryLogs(filters?: {
  tenantId?: string;
  model?: string;
  minDuration?: number;
}): QueryLog[] {
  let logs = [...queryLogs];

  if (filters?.tenantId) {
    logs = logs.filter((log) => log.tenantId === filters.tenantId);
  }

  if (filters?.model) {
    logs = logs.filter((log) => log.model === filters.model);
  }

  if (filters?.minDuration) {
    logs = logs.filter((log) => log.duration >= filters.minDuration);
  }

  return logs;
}

/**
 * Get query statistics
 */
export function getQueryStats(tenantId?: string) {
  const logs = tenantId
    ? queryLogs.filter((log) => log.tenantId === tenantId)
    : queryLogs;

  if (logs.length === 0) {
    return {
      totalQueries: 0,
      avgDuration: 0,
      maxDuration: 0,
      slowQueries: 0,
    };
  }

  const durations = logs.map((log) => log.duration);
  const total = durations.reduce((sum, d) => sum + d, 0);

  return {
    totalQueries: logs.length,
    avgDuration: Math.round(total / logs.length),
    maxDuration: Math.max(...durations),
    slowQueries: logs.filter((log) => log.duration > 1000).length,
    byModel: getQueryCountByModel(logs),
  };
}

/**
 * Get query count by model
 */
function getQueryCountByModel(logs: QueryLog[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const log of logs) {
    counts[log.model] = (counts[log.model] || 0) + 1;
  }

  return counts;
}

/**
 * Clear query logs
 */
export function clearQueryLogs(): void {
  queryLogs.length = 0;
}

/**
 * Export query logs to JSON
 */
export function exportQueryLogs(): string {
  return JSON.stringify(queryLogs, null, 2);
}
