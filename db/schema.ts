import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("last_sign_in_at").defaultNow().notNull(),
});

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  technique: varchar("technique", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  correct: integer("correct").default(0).notNull(),
  total: integer("total").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastPracticed: timestamp("last_practiced").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  product: varchar("product", { length: 100 }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("inactive").notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  teacherId: varchar("teacher_id", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const classEnrollments = pgTable(
  "class_enrollments",
  {
    id: serial("id").primaryKey(),
    classId: integer("class_id").notNull(),
    studentUserId: varchar("student_user_id", { length: 255 }).notNull(),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => ({
    classStudentIdx: uniqueIndex("class_student_idx").on(table.classId, table.studentUserId),
  }),
);

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  technique: varchar("technique", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  problemCount: integer("problem_count").notNull().default(10),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assignmentProgress = pgTable(
  "assignment_progress",
  {
    id: serial("id").primaryKey(),
    assignmentId: integer("assignment_id").notNull(),
    studentUserId: varchar("student_user_id", { length: 255 }).notNull(),
    problemsCompleted: integer("problems_completed").notNull().default(0),
    correctCount: integer("correct_count").notNull().default(0),
    timeSpentSeconds: integer("time_spent_seconds").notNull().default(0),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    assignmentStudentIdx: uniqueIndex("assignment_student_idx").on(table.assignmentId, table.studentUserId),
  }),
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Progress = typeof progressTable.$inferSelect;
export type InsertProgress = typeof progressTable.$inferInsert;
export type Subscription = typeof subscriptionsTable.$inferSelect;
export type InsertSubscription = typeof subscriptionsTable.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;
export type ClassEnrollment = typeof classEnrollments.$inferSelect;
export type InsertClassEnrollment = typeof classEnrollments.$inferInsert;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;
export type AssignmentProgress = typeof assignmentProgress.$inferSelect;
export type InsertAssignmentProgress = typeof assignmentProgress.$inferInsert;
