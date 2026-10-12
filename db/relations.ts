import { relations } from "drizzle-orm";
import {
  users,
  progressTable,
  subscriptionsTable,
  classes,
  classEnrollments,
  assignments,
  assignmentProgress,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  progress: many(progressTable),
  subscriptions: many(subscriptionsTable),
}));

export const progressRelations = relations(progressTable, ({ one }) => ({
  user: one(users, {
    fields: [progressTable.userId],
    references: [users.clerkId],
  }),
}));

export const subscriptionsRelations = relations(subscriptionsTable, ({ one }) => ({
  user: one(users, {
    fields: [subscriptionsTable.userId],
    references: [users.clerkId],
  }),
}));

export const classesRelations = relations(classes, ({ many }) => ({
  enrollments: many(classEnrollments),
  assignments: many(assignments),
}));

export const classEnrollmentsRelations = relations(classEnrollments, ({ one }) => ({
  class: one(classes, {
    fields: [classEnrollments.classId],
    references: [classes.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
  }),
  progress: many(assignmentProgress),
}));

export const assignmentProgressRelations = relations(assignmentProgress, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentProgress.assignmentId],
    references: [assignments.id],
  }),
}));
