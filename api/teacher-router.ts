import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, and, inArray } from "drizzle-orm";
import { authedQuery, createRouter } from "./middleware";
import { getDb } from "./queries/connection";
import {
  classes,
  classEnrollments,
  assignments,
  assignmentProgress,
} from "@db/schema";

function generateClassCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createUniqueClassCode(): Promise<string> {
  const db = getDb();
  let code = generateClassCode();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await db.query.classes.findFirst({
      where: eq(classes.code, code),
    });
    if (!existing) return code;
    code = generateClassCode();
    attempts++;
  }
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Unable to generate a unique class code",
  });
}

export const teacherRouter = createRouter({
    createClass: authedQuery
      .input(
        z.object({
          name: z.string().min(1).max(255),
          subject: z.string().max(50).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = getDb();
        const code = await createUniqueClassCode();
        const [cls] = await db
          .insert(classes)
          .values({
            name: input.name,
            code,
            teacherId: ctx.userId,
            subject: input.subject || null,
          })
          .returning();
        return { id: cls.id, name: cls.name, code: cls.code };
      }),

    getClasses: authedQuery.query(async ({ ctx }) => {
      const db = getDb();
      const result = await db.query.classes.findMany({
        where: eq(classes.teacherId, ctx.userId),
        with: {
          enrollments: true,
          assignments: true,
        },
      });
      return result.map((cls) => ({
        id: cls.id,
        name: cls.name,
        code: cls.code,
        subject: cls.subject,
        studentCount: cls.enrollments.length,
        assignmentCount: cls.assignments.length,
        createdAt: cls.createdAt,
      }));
    }),

    getClassByCode: authedQuery
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const db = getDb();
        const cls = await db.query.classes.findFirst({
          where: eq(classes.code, input.code),
        });
        if (!cls) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Class not found",
          });
        }
        return { id: cls.id, name: cls.name, code: cls.code, subject: cls.subject };
      }),

    joinClass: authedQuery
      .input(z.object({ code: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = getDb();
        const cls = await db.query.classes.findFirst({
          where: eq(classes.code, input.code),
        });
        if (!cls) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Class not found",
          });
        }
        if (cls.teacherId === ctx.userId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You cannot join your own class",
          });
        }
        const existing = await db.query.classEnrollments.findFirst({
          where: and(
            eq(classEnrollments.classId, cls.id),
            eq(classEnrollments.studentUserId, ctx.userId),
          ),
        });
        if (existing) {
          return { classId: cls.id, name: cls.name };
        }
        await db.insert(classEnrollments).values({
          classId: cls.id,
          studentUserId: ctx.userId,
        });
        return { classId: cls.id, name: cls.name };
      }),

    getMyClasses: authedQuery.query(async ({ ctx }) => {
      const db = getDb();
      const enrollments = await db.query.classEnrollments.findMany({
        where: eq(classEnrollments.studentUserId, ctx.userId),
        with: { class: true },
      });
      return enrollments.map((e) => ({
        id: e.class.id,
        name: e.class.name,
        code: e.class.code,
        subject: e.class.subject,
        joinedAt: e.joinedAt,
      }));
    }),

    createAssignment: authedQuery
      .input(
        z.object({
          classId: z.number().int(),
          subject: z.string().min(1).max(50),
          technique: z.string().min(1).max(100),
          difficulty: z.string().min(1).max(20),
          problemCount: z.number().int().min(1).max(100).default(10),
          dueDate: z.string().datetime().optional().nullable(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = getDb();
        const cls = await db.query.classes.findFirst({
          where: eq(classes.id, input.classId),
        });
        if (!cls || cls.teacherId !== ctx.userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not own this class",
          });
        }
        const [assignment] = await db
          .insert(assignments)
          .values({
            classId: input.classId,
            subject: input.subject,
            technique: input.technique,
            difficulty: input.difficulty,
            problemCount: input.problemCount,
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
          })
          .returning();
        return assignment;
      }),

    getAssignments: authedQuery
      .input(z.object({ classId: z.number().int().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = getDb();
        if (input?.classId) {
          const cls = await db.query.classes.findFirst({
            where: eq(classes.id, input.classId),
          });
          if (!cls || cls.teacherId !== ctx.userId) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not own this class",
            });
          }
          const result = await db.query.assignments.findMany({
            where: eq(assignments.classId, input.classId),
            with: { progress: true },
          });
          return result.map((a) => ({
            ...a,
            progress: a.progress,
          }));
        }

        // Student view: assignments for enrolled classes
        const enrollments = await db.query.classEnrollments.findMany({
          where: eq(classEnrollments.studentUserId, ctx.userId),
        });
        const classIds = enrollments.map((e) => e.classId);
        if (classIds.length === 0) return [];
        const result = await db.query.assignments.findMany({
          where: inArray(assignments.classId, classIds),
          with: { class: true, progress: true },
        });
        return result.map((a) => ({
          ...a,
          className: a.class.name,
          studentProgress: a.progress.find((p) => p.studentUserId === ctx.userId) || null,
        }));
      }),

    getAssignment: authedQuery
      .input(z.object({ id: z.number().int() }))
      .query(async ({ ctx, input }) => {
        const db = getDb();
        const assignment = await db.query.assignments.findFirst({
          where: eq(assignments.id, input.id),
          with: { class: true, progress: true },
        });
        if (!assignment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment not found",
          });
        }
        const isTeacher = assignment.class.teacherId === ctx.userId;
        const isEnrolled = await db.query.classEnrollments.findFirst({
          where: and(
            eq(classEnrollments.classId, assignment.classId),
            eq(classEnrollments.studentUserId, ctx.userId),
          ),
        });
        if (!isTeacher && !isEnrolled) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this assignment",
          });
        }
        return {
          ...assignment,
          className: assignment.class.name,
          studentProgress:
            assignment.progress.find((p) => p.studentUserId === ctx.userId) || null,
        };
      }),

    saveAssignmentProgress: authedQuery
      .input(
        z.object({
          assignmentId: z.number().int(),
          problemsCompleted: z.number().int().min(0),
          correctCount: z.number().int().min(0),
          timeSpentSeconds: z.number().int().min(0),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = getDb();
        const assignment = await db.query.assignments.findFirst({
          where: eq(assignments.id, input.assignmentId),
        });
        if (!assignment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment not found",
          });
        }
        const isEnrolled = await db.query.classEnrollments.findFirst({
          where: and(
            eq(classEnrollments.classId, assignment.classId),
            eq(classEnrollments.studentUserId, ctx.userId),
          ),
        });
        if (!isEnrolled) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not enrolled in this class",
          });
        }

        const completedAt =
          input.problemsCompleted >= assignment.problemCount ? new Date() : null;

        const existing = await db.query.assignmentProgress.findFirst({
          where: and(
            eq(assignmentProgress.assignmentId, input.assignmentId),
            eq(assignmentProgress.studentUserId, ctx.userId),
          ),
        });

        if (existing) {
          const [updated] = await db
            .update(assignmentProgress)
            .set({
              problemsCompleted: input.problemsCompleted,
              correctCount: input.correctCount,
              timeSpentSeconds: input.timeSpentSeconds,
              completedAt,
            })
            .where(eq(assignmentProgress.id, existing.id))
            .returning();
          return updated;
        }

        const [created] = await db
          .insert(assignmentProgress)
          .values({
            assignmentId: input.assignmentId,
            studentUserId: ctx.userId,
            problemsCompleted: input.problemsCompleted,
            correctCount: input.correctCount,
            timeSpentSeconds: input.timeSpentSeconds,
            completedAt,
          })
          .returning();
        return created;
      }),

    getClassAnalytics: authedQuery
      .input(z.object({ classId: z.number().int() }))
      .query(async ({ ctx, input }) => {
        const db = getDb();
        const cls = await db.query.classes.findFirst({
          where: eq(classes.id, input.classId),
        });
        if (!cls || cls.teacherId !== ctx.userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not own this class",
          });
        }

        const classAssignments = await db.query.assignments.findMany({
          where: eq(assignments.classId, input.classId),
        });
        const assignmentIds = classAssignments.map((a) => a.id);

        const enrollments = await db.query.classEnrollments.findMany({
          where: eq(classEnrollments.classId, input.classId),
        });

        const progressRows =
          assignmentIds.length > 0
            ? await db.query.assignmentProgress.findMany({
                where: inArray(assignmentProgress.assignmentId, assignmentIds),
              })
            : [];

        const progressByStudent = new Map<string, typeof progressRows>();
        for (const row of progressRows) {
          const list = progressByStudent.get(row.studentUserId) || [];
          list.push(row);
          progressByStudent.set(row.studentUserId, list);
        }

        const students = enrollments.map((e) => {
          const rows = progressByStudent.get(e.studentUserId) || [];
          const problemsCompleted = rows.reduce((sum, r) => sum + r.problemsCompleted, 0);
          const correctCount = rows.reduce((sum, r) => sum + r.correctCount, 0);
          const timeSpent = rows.reduce((sum, r) => sum + r.timeSpentSeconds, 0);
          const accuracy = problemsCompleted > 0 ? Math.round((correctCount / problemsCompleted) * 100) : 0;
          return {
            userId: e.studentUserId,
            name: e.studentUserId,
            problemsCompleted,
            correctCount,
            accuracy,
            timeSpent,
          };
        });

        const totalAccuracy = students.reduce((sum, s) => sum + s.accuracy, 0);
        const avgScore = students.length > 0 ? Math.round(totalAccuracy / students.length) : 0;

        const techniqueMap = new Map<string, { attempted: number; correct: number }>();
        for (const assignment of classAssignments) {
          const stats = techniqueMap.get(assignment.technique) || { attempted: 0, correct: 0 };
          const rows = progressRows.filter((r) => r.assignmentId === assignment.id);
          for (const row of rows) {
            stats.attempted += row.problemsCompleted;
            stats.correct += row.correctCount;
          }
          techniqueMap.set(assignment.technique, stats);
        }
        const weakAreas = Array.from(techniqueMap.entries())
          .filter(([, stats]) => stats.attempted > 0)
          .map(([technique, stats]) => ({
            technique,
            accuracy: Math.round((stats.correct / stats.attempted) * 100),
          }))
          .sort((a, b) => a.accuracy - b.accuracy)
          .slice(0, 5);

        return { students, avgScore, weakAreas };
      }),

    exportCSV: authedQuery
      .input(z.object({ classId: z.number().int(), assignmentId: z.number().int().optional() }))
      .query(async ({ ctx, input }) => {
        const db = getDb();
        const cls = await db.query.classes.findFirst({
          where: eq(classes.id, input.classId),
        });
        if (!cls || cls.teacherId !== ctx.userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not own this class",
          });
        }

        const enrollments = await db.query.classEnrollments.findMany({
          where: eq(classEnrollments.classId, input.classId),
        });
        const studentIds = enrollments.map((e) => e.studentUserId);

        let progressRows: (typeof assignmentProgress.$inferSelect)[] = [];
        if (input.assignmentId) {
          progressRows = await db.query.assignmentProgress.findMany({
            where: and(
              eq(assignmentProgress.assignmentId, input.assignmentId),
              inArray(assignmentProgress.studentUserId, studentIds),
            ),
          });
        } else {
          const classAssignments = await db.query.assignments.findMany({
            where: eq(assignments.classId, input.classId),
          });
          const assignmentIds = classAssignments.map((a) => a.id);
          if (assignmentIds.length > 0) {
            progressRows = await db.query.assignmentProgress.findMany({
              where: inArray(assignmentProgress.assignmentId, assignmentIds),
            });
          }
        }

        const progressByStudent = new Map<string, typeof progressRows>();
        for (const row of progressRows) {
          const list = progressByStudent.get(row.studentUserId) || [];
          list.push(row);
          progressByStudent.set(row.studentUserId, list);
        }

        const header = ["Student ID", "Problems Completed", "Correct", "Accuracy %", "Time Spent (s)"];
        const rows = studentIds.map((id) => {
          const rows = progressByStudent.get(id) || [];
          const problemsCompleted = rows.reduce((sum, r) => sum + r.problemsCompleted, 0);
          const correctCount = rows.reduce((sum, r) => sum + r.correctCount, 0);
          const timeSpent = rows.reduce((sum, r) => sum + r.timeSpentSeconds, 0);
          const accuracy = problemsCompleted > 0 ? Math.round((correctCount / problemsCompleted) * 100) : 0;
          return [id, problemsCompleted, correctCount, accuracy, timeSpent];
        });

        const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
        const csv = [header.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
        return csv;
      }),
  });
