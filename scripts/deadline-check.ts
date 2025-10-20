#!/usr/bin/env tsx

/**
 * Deadline Monitor Cron Job (TypeScript)
 *
 * This script checks for projects with expired change request deadlines
 * and auto-rejects them. It should be run daily via cron job.
 *
 * Usage:
 *   npm run deadline-check
 *   tsx scripts/deadline-check.ts
 *
 * Cron job example (runs daily at 2 AM):
 *   0 2 * * * cd /path/to/project-hub && npm run deadline-check
 */

import {
  checkExpiredChangeRequests,
  getChangeRequestStats,
} from "../src/lib/deadline-monitor";

async function main() {
  console.log("🕐 Starting deadline check...");
  console.log(`📅 Current time: ${new Date().toISOString()}`);

  try {
    // Get current stats before processing
    const statsBefore = await getChangeRequestStats();
    console.log("📊 Stats before processing:", statsBefore);

    // Check for expired change requests
    const result = await checkExpiredChangeRequests();

    if (result.success) {
      console.log(`✅ ${result.message}`);

      // Get updated stats
      const statsAfter = await getChangeRequestStats();
      console.log("📊 Stats after processing:", statsAfter);

      // Exit with success code
      process.exit(0);
    } else {
      console.error(`❌ Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  }
}

// Run the script
main();
