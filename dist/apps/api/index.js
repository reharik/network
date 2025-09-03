// apps/api/src/koaServer.ts
import Koa from "koa";
import { koaBody } from "koa-body";
import dotenv2 from "dotenv";

// apps/api/src/middleware/errorHandler.ts
import { HttpError } from "koa";
async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    if (err instanceof HttpError) {
      ctx.status = err.status || 500;
      ctx.body = { error: err.expose ? err.message : "Internal Server Error" };
    } else if (err instanceof Error) {
      ctx.body = { error: err.message ? err.message : "Internal Server Error" };
    }
    ctx.app.emit("error", err, ctx);
  }
}

// apps/api/src/koaServer.ts
import http from "http";

// apps/api/src/knex.ts
import knex from "knex";

// apps/api/src/knexfile.ts
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
var ROOT = path.resolve(__dirname, "..");
var MIGRATIONS_DIR = path.join(ROOT, "db/migrations");
var SEEDS_DIR = path.join(ROOT, "db/seeds");
var connection = {
  host: process.env.POSTGRES_HOST || "127.0.0.1",
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER || "postgres",
  password: String(process.env.POSTGRES_PASSWORD || ""),
  database: process.env.POSTGRES_DB || "network"
};
var knexConfig = {
  client: "pg",
  connection,
  migrations: {
    directory: MIGRATIONS_DIR,
    tableName: "knex_migrations",
    extension: "ts"
  },
  seeds: {
    directory: SEEDS_DIR,
    extension: "ts"
  }
};

// apps/api/src/knex.ts
var db = knex.knex(knexConfig);
process.on("SIGINT", async () => {
  await db.destroy();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await db.destroy();
  process.exit(0);
});

// apps/api/src/routes/index.ts
import Router5 from "@koa/router";

// apps/api/src/routes/contactRoutes.ts
import Router from "@koa/router";

// packages/contracts/src/enums/ContactMethod.ts
import { enumeration } from "smart-enums";
var input = ["email", "sms", "call", "other"];
var ContactMethod = enumeration({
  input
});
var parseContactMethod = (s) => ContactMethod.tryFromValue(s) ?? ContactMethod.tryFromKey(s) ?? ContactMethod.tryFromDisplay(s);

// packages/contracts/src/schemas/schemas.ts
import { z } from "zod";
var contactMethodValueSchema = z.string().transform((s, ctx) => {
  const item = parseContactMethod(s);
  if (!item) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid contact method: ${s}`
    });
    return z.NEVER;
  }
  return item.value;
});
var contactSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  preferredMethod: contactMethodValueSchema,
  email: z.string().email().nullable().optional(),
  phone: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
  intervalDays: z.number().int().min(1).max(365),
  paused: z.boolean().optional(),
  snoozedUntil: z.string().datetime().nullable().optional(),
  nextDueAt: z.string().datetime().optional(),
  lastTouchedAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});
var upsertContactSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  firstName: z.string().min(1).max(200).optional(),
  lastName: z.string().min(1).max(200).optional(),
  preferredMethod: contactMethodValueSchema.optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
  paused: z.boolean().optional(),
  snoozedUntil: z.string().datetime().nullable().optional(),
  intervalDays: z.coerce.number().int().min(1).max(365).optional()
}).refine((v) => Object.keys(v).length > 0, {
  message: "At least one field must be provided"
});
var dailyPlanSchema = z.object({
  items: z.array(contactSchema),
  date: z.string().datetime()
});
var uuidParam = z.string().uuid();
var listContactsQuerySchema = z.object({
  dueOnly: z.union([z.literal("true"), z.literal("false")]).optional().transform((v) => v === "true"),
  q: z.string().trim().min(1).optional()
});
var createTouchSchema = z.object({
  contactId: uuidParam,
  method: z.enum(["EMAIL", "SMS", "CALL", "OTHER"]),
  message: z.string().trim().optional(),
  outcome: z.string().trim().optional()
});
var planQuerySchema = z.object({
  date: z.string().datetime().optional()
});
var upsertDailyGoalSchema = z.object({
  dailyGoal: z.coerce.number().int().min(0).max(500)
});

// apps/api/src/repositories/mappers.ts
var toContactEntity = (dto) => {
  return dto ? {
    ...dto,
    preferredMethod: ContactMethod.fromValue(dto.preferredMethod)
  } : void 0;
};
var toTouchEntity = (dto) => {
  return dto ? {
    ...dto,
    method: ContactMethod.fromValue(dto.method)
  } : void 0;
};

// apps/api/src/repositories/contactRepository.ts
import { v4 } from "uuid";
var listContacts = async (db2, userId, opts) => {
  let q = db2("contacts").where({ userId });
  if (opts?.dueOnly) q = q.andWhere("nextDueAt", "<=", db2.fn.now());
  if (opts?.q) {
    q = q.andWhere((qb) => {
      qb.whereILike("firstName", `%${opts.q}%`).orWhereILike("lastName", `%${opts.q}%`).orWhereILike("email", `%${opts.q}%`).orWhereILike("phone", `%${opts.q}%`);
    });
  }
  return q.orderBy([
    { column: "lastName", order: "asc" },
    { column: "firstName", order: "asc" }
  ]);
};
var createContact = async (db2, userId, data) => {
  const payload = {
    ...data,
    id: v4(),
    userId
  };
  const [row] = await db2("contacts").insert(payload).returning("*");
  return toContactEntity(row);
};
var patchContact = async (db2, userId, id, data) => {
  const existing = await db2("contacts").where({ id, userId }).first();
  if (!existing) return null;
  const updates = { ...existing, ...data };
  const [row] = await db2("contacts").where({ id, userId }).update(updates, "*");
  return row ?? null;
};

// apps/api/src/controllers/contactsController.ts
var getContacts = async (ctx) => {
  const userId = ctx.user.id;
  const rows = await listContacts(ctx.db, userId, {
    /* dueOnly, q parsed elsewhere if needed */
  });
  ctx.status = 200;
  ctx.body = rows;
  return ctx;
};
var createContact2 = async (ctx) => {
  const parsed = upsertContactSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: "Invalid request format", issues: parsed.error.issues };
    return ctx;
  }
  const body = parsed.data;
  const userId = ctx.user.id;
  const created = await createContact(ctx.db, userId, {
    ...body,
    preferredMethod: body.preferredMethod ?? ContactMethod.email.value
  });
  ctx.status = 201;
  ctx.body = created;
  return ctx;
};
var patchContact2 = async (ctx) => {
  const parsed = upsertContactSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: "Invalid request format", issues: parsed.error.issues };
    return ctx;
  }
  const body = parsed.data;
  const userId = ctx.user.id;
  const updated = await patchContact(ctx.db, userId, ctx.params.id, body);
  if (!updated) {
    ctx.status = 404;
    ctx.body = { error: "Contact not found" };
    return ctx;
  }
  ctx.status = 200;
  ctx.body = updated;
  return ctx;
};

// apps/api/src/routes/contactRoutes.ts
var contactsRouter = new Router({ prefix: "/api/contacts" });
contactsRouter.get("/", getContacts);
contactsRouter.post("/", createContact2);
contactsRouter.patch("/:id", patchContact2);

// apps/api/src/routes/touchesRoutes.ts
import Router2 from "@koa/router";

// apps/api/src/repositories/touchesRepository.ts
var createTouch = async (db2, userId, body) => {
  const contact = await db2("contacts").where({ id: body.contactId, userId }).first();
  if (!contact) return null;
  const [touch] = await db2("touch_logs").insert({
    id: db2.raw("gen_random_uuid()"),
    userId,
    contactId: body.contactId,
    method: body.method,
    message: body.message,
    outcome: body.outcome,
    createdAt: db2.fn.now()
  }).returning("*");
  const nextDueAt = new Date(
    Date.now() + (contact.intervalDays ?? 0) * 864e5
  ).toISOString();
  await db2("contacts").where({ id: contact.id }).update({ lastTouchedAt: db2.fn.now(), nextDueAt });
  return toTouchEntity(touch);
};

// apps/api/src/controllers/touchesController.ts
var createTouch2 = async (ctx) => {
  const val = createTouchSchema.safeParse(ctx.request.body);
  if (!val.success) {
    ctx.status = 400;
    ctx.body = { error: "Invalid request format", issues: val.error.issues };
    return ctx;
  }
  const userId = ctx.user.id;
  const touch = await createTouch(ctx.db, userId, val.data);
  if (!touch) {
    ctx.status = 404;
    ctx.body = { error: "Contact not found" };
    return ctx;
  }
  ctx.status = 201;
  ctx.body = touch;
  return ctx;
};

// apps/api/src/routes/touchesRoutes.ts
var touchesRouter = new Router2({ prefix: "/api/touches" });
touchesRouter.post("/", createTouch2);

// apps/api/src/routes/planRoutes.ts
import Router3 from "@koa/router";

// apps/api/src/repositories/planRepository.ts
import { DateTime } from "luxon";
var getDailyPlan = async (db2, userId, date) => {
  const user = await db2("users").where({ id: userId }).first();
  if (!user) return { items: [], date: DateTime.now().toISO() };
  const dayStart = date ? DateTime.fromISO(date).startOf("day") : DateTime.now().startOf("day");
  const due = await db2("contacts").where({ userId, paused: false }).andWhere(
    (qb) => qb.whereNull("snoozedUntil").orWhere("snoozedUntil", "<=", db2.fn.now())
  ).andWhere("nextDueAt", "<=", dayStart.toJSDate()).orderBy([
    { column: "nextDueAt", order: "asc" },
    { column: "updatedAt", order: "asc" },
    { column: "fullName", order: "asc" }
  ]).limit(user.dailyGoal);
  if (due.length >= user.dailyGoal) {
    return { items: due, date: dayStart.toISO() };
  }
  const topUp = await db2("contacts").where({ userId, paused: false }).andWhere(
    (qb) => qb.whereNull("snoozedUntil").orWhere("snoozedUntil", "<=", db2.fn.now())
  ).andWhere("nextDueAt", ">", dayStart.toJSDate()).andWhere("nextDueAt", "<=", dayStart.plus({ days: 3 }).toJSDate()).orderBy([
    { column: "nextDueAt", order: "asc" },
    { column: "updatedAt", order: "asc" },
    { column: "fullName", order: "asc" }
  ]).limit(user.dailyGoal - due.length);
  return { items: [...due, ...topUp], date: dayStart.toISO() };
};

// apps/api/src/controllers/planController.ts
var getDailyPlan2 = async (ctx) => {
  const val = planQuerySchema.safeParse(ctx.request.query);
  if (!val.success) {
    ctx.status = 400;
    ctx.body = { error: "Invalid request format", issues: val.error.issues };
    return ctx;
  }
  const userId = ctx.state.user.id;
  const result = await getDailyPlan(ctx.db, userId, val.data.date);
  ctx.status = 200;
  ctx.body = result;
  return ctx;
};

// apps/api/src/routes/planRoutes.ts
var planRouter = new Router3({ prefix: "/api/plan" });
planRouter.get("/", getDailyPlan2);

// apps/api/src/routes/userRoutes.ts
import Router4 from "@koa/router";

// apps/api/src/repositories/userRepository.ts
var getUser = (db2, id) => db2("users").where({ id }).first();
var updateDailyGoal = async (db2, id, dailyGoal) => {
  const [row] = await db2("users").where({ id }).update({ dailyGoal }, "*");
  return row;
};

// apps/api/src/controllers/userController.ts
var getMe = async (ctx) => {
  const userId = ctx.state.user.id;
  const user = await getUser(ctx.db, userId);
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: "User not found" };
    return ctx;
  }
  ctx.status = 200;
  ctx.body = user;
  return ctx;
};
var updateDailyGoal2 = async (ctx) => {
  const val = upsertDailyGoalSchema.safeParse(ctx.request.body);
  if (!val.success) {
    ctx.status = 400;
    ctx.body = { error: "Invalid request format", issues: val.error.issues };
    return ctx;
  }
  const userId = ctx.state.user.id;
  const updated = await updateDailyGoal(ctx.db, userId, val.data.dailyGoal);
  if (!updated) {
    ctx.status = 404;
    ctx.body = { error: "User not found" };
    return ctx;
  }
  ctx.status = 200;
  ctx.body = updated;
  return ctx;
};

// apps/api/src/routes/userRoutes.ts
var userRouter = new Router4({ prefix: "/api/me" });
userRouter.get("/", getMe);
userRouter.patch("/daily-goal", updateDailyGoal2);

// apps/api/src/routes/index.ts
var mountRoutes = (app2) => {
  const root = new Router5();
  root.use(contactsRouter.routes(), contactsRouter.allowedMethods());
  root.use(touchesRouter.routes(), touchesRouter.allowedMethods());
  root.use(planRouter.routes(), planRouter.allowedMethods());
  root.use(userRouter.routes(), userRouter.allowedMethods());
  app2.use(root.routes()).use(root.allowedMethods());
};

// apps/api/src/middleware/requestLogger.ts
async function requestLogger(ctx, next) {
  console.log("REQ", ctx.method, ctx.path);
  await next();
  console.log("RES", ctx.status, ctx.path);
}

// apps/api/src/koaServer.ts
dotenv2.config();
var app = new Koa();
app.context.db = db;
app.on("error", (err, ctx) => {
  console.error(`Unhandled error on ${ctx.method} ${ctx.path}`, {
    status: ctx.status,
    requestId: ctx.get("x-request-id") || void 0
  });
  if (err?.stack) console.error(err.stack);
  else console.error(err);
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});
app.use(errorHandler);
app.use(requestLogger);
app.use(koaBody());
mountRoutes(app);
var server = http.createServer(app.callback());

// apps/api/src/index.ts
var PORT = process.env.PORT || 3e3;
server.listen(PORT, () => {
  console.log(`\u{1F680} Server running on http://localhost:${PORT}`);
});
