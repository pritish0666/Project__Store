import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";

/**
 * Auto-reject projects that have exceeded their change request deadline
 * This function should be called by a cron job daily
 */
export async function checkExpiredChangeRequests() {
  try {
    await connectDB();

    const now = new Date();

    // Find projects with status "needs-changes" that have exceeded their deadline
    const expiredProjects = await Project.find({
      status: "needs-changes",
      "changeRequest.deadline": { $lt: now },
    }).populate("submittedBy", "name email");

    console.log(
      `Found ${expiredProjects.length} projects with expired change requests`
    );

    for (const project of expiredProjects) {
      // Update project status to rejected
      project.status = "rejected";
      project.rejectionReason =
        "Deadline exceeded - changes not submitted in time";
      project.reviewedAt = new Date();

      // Add to review history
      project.reviewHistory.push({
        action: "reject",
        adminId: null, // System action
        timestamp: new Date(),
        notes: "Auto-rejected due to expired deadline",
      });

      // Clear the change request
      project.changeRequest = undefined;

      await project.save();

      console.log(
        `Auto-rejected project: ${project.title} (ID: ${project._id})`
      );

      // TODO: Send notification email to user
      // await sendDeadlineExceededNotification(project.submittedBy.email, project.title);
    }

    return {
      success: true,
      expiredCount: expiredProjects.length,
      message: `Auto-rejected ${expiredProjects.length} projects with expired deadlines`,
    };
  } catch (error) {
    console.error("Error checking expired change requests:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get statistics about projects with change requests
 */
export async function getChangeRequestStats() {
  try {
    await connectDB();

    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const stats = await Project.aggregate([
      {
        $match: { status: "needs-changes" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          expiringToday: {
            $sum: {
              $cond: [
                { $lt: ["$changeRequest.deadline", oneDayFromNow] },
                1,
                0,
              ],
            },
          },
          expiringSoon: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$changeRequest.deadline", oneDayFromNow] },
                    { $lt: ["$changeRequest.deadline", threeDaysFromNow] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return stats[0] || { total: 0, expiringToday: 0, expiringSoon: 0 };
  } catch (error) {
    console.error("Error getting change request stats:", error);
    return { total: 0, expiringToday: 0, expiringSoon: 0 };
  }
}
