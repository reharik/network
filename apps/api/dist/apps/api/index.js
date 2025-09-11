// src/koaServer.ts
import cors from "@koa/cors";
import Router from "@koa/router";
import dotenv2 from "dotenv";
import http from "http";
import Koa from "koa";
import { koaBody } from "koa-body";

// src/container.ts
import { asFunction, asValue, createContainer } from "awilix";

// src/knex.ts
import knex from "knex";

// src/knexfile.ts
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
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

// src/knex.ts
var database = knex(knexConfig);
process.on("SIGINT", async () => {
  await database.destroy();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await database.destroy();
  process.exit(0);
});

// src/repositories/contactRepository.ts
import { v4 } from "uuid";
var createContactRepository = ({
  connection: connection2,
  mappers
}) => ({
  listContacts: async (userId, opts) => {
    let q = connection2("contacts").where({ userId });
    if (opts?.dueOnly) q = q.andWhere("nextDueAt", "<=", connection2.fn.now());
    if (opts?.q) {
      q = q.andWhere((qb) => {
        qb.whereILike("firstName", `%${opts.q}%`).orWhereILike("lastName", `%${opts.q}%`).orWhereILike("email", `%${opts.q}%`).orWhereILike("phone", `%${opts.q}%`);
      });
    }
    const rows = await q.orderBy([
      { column: "lastName", order: "asc" },
      { column: "firstName", order: "asc" }
    ]);
    const entities = rows.map((row) => mappers.toContactEntity(row)).filter((entity) => entity !== void 0);
    return entities;
  },
  createContact: async (userId, data) => {
    const payload = {
      ...data,
      id: v4(),
      userId
    };
    const [row] = await connection2("contacts").insert(payload).returning("*");
    const entity = mappers.toContactEntity(row);
    if (!entity) throw new Error("Failed to create contact");
    return entity;
  },
  getContact: async (userId, id) => {
    const dto = await connection2("contacts").where({ id, userId }).first();
    return mappers.toContactEntity(dto);
  },
  patchContact: async (userId, id, data) => {
    const existing = await connection2("contacts").where({ id, userId }).first();
    if (!existing) return void 0;
    const updates = { ...existing, ...data };
    const [row] = await connection2("contacts").where({ id, userId }).update(updates, "*");
    const entity = mappers.toContactEntity(row);
    return entity || void 0;
  }
});

// src/repositories/planRepository.ts
import { DateTime } from "luxon";
var createPlanRepository = ({
  connection: connection2,
  mappers
}) => ({
  getDailyPlan: async (userId) => {
    const user = await connection2("users").where({ id: userId }).first();
    if (!user) return [];
    const dayStart = DateTime.now().startOf("day");
    const due = await connection2("contacts").where({ userId, paused: false }).andWhere(
      (qb) => qb.whereNull("snoozedUntil").orWhere("snoozedUntil", "<=", connection2.fn.now())
    ).andWhere("nextDueAt", "<=", dayStart.toJSDate()).orderBy([
      { column: "nextDueAt", order: "asc" },
      { column: "updatedAt", order: "asc" },
      { column: "lastName", order: "asc" }
    ]).limit(user.dailyGoal);
    const contactEntities = due.map((row) => mappers.toContactEntity(row)).filter((entity) => entity !== void 0);
    return contactEntities;
  }
});

// src/repositories/suggestionRepository.ts
var createSuggestionRepository = ({
  connection: connection2
}) => ({
  getSuggestionsForContact: async (contact) => {
    const firstName = contact.fullName.split(" ")[0];
    const rows = await connection2("suggestionTemplates").select("body").orderBy("createdAt", "asc").limit(10);
    const pool = rows.length ? rows.map((r) => r.body) : [
      "Hi {{firstName}}, just checking in to see how you're doing.",
      "Hey {{firstName}} \u2014 thought of you today. How's your week going?",
      "Hi {{firstName}}! Anything new or fun lately? Would love to catch up."
    ];
    const picks = [];
    for (const s of pool) {
      const msg = s.replaceAll("{{firstName}}", firstName);
      if (!picks.includes(msg)) picks.push(msg);
      if (picks.length >= 3) break;
    }
    return picks;
  }
});

// src/repositories/touchesRepository.ts
var createTouchesRepository = ({
  connection: connection2,
  mappers
}) => ({
  createTouch: async (userId, body) => {
    const contact = await connection2("contacts").where({ id: body.contactId, userId }).first();
    if (!contact) return void 0;
    const [touch] = await connection2("touch_logs").insert({
      id: connection2.raw("gen_random_uuid()"),
      userId,
      contactId: body.contactId,
      method: body.method,
      message: body.message,
      outcome: body.outcome,
      createdAt: connection2.fn.now()
    }).returning("*");
    const nextDueAt = new Date(Date.now() + (contact.intervalDays ?? 0) * 864e5).toISOString();
    await connection2("contacts").where({ id: contact.id }).update({ lastTouchedAt: connection2.fn.now(), nextDueAt });
    const entity = mappers.toTouchEntity(touch);
    return entity || void 0;
  }
});

// src/repositories/userRepository.ts
var createUserRepository = ({ connection: connection2 }) => ({
  getUser: async (id) => {
    const result = await connection2("users").where({ id }).first();
    return result;
  },
  updateDailyGoal: async (id, dailyGoal) => {
    const [row] = await connection2("users").where({ id }).update({ dailyGoal }, "*");
    return row;
  }
});

// ../../packages/contracts/src/enums/ContactMethod.ts
import { enumeration } from "smart-enums";
var input = {
  email: {
    link: (contactable) => `mailto:${contactable.email}`,
    handle: (contactable) => contactable.email
  },
  sms: {
    link: (contactable) => `sms:${contactable.sms}`,
    handle: (contactable) => contactable.sms
  },
  call: {
    link: (contactable) => `tel:${contactable.call}`,
    handle: (contactable) => contactable.call
  },
  other: { link: () => "#", handle: () => "" }
};
var ContactMethod = enumeration({
  input
});

// ../../packages/contracts/src/schemas/schemas.ts
import { z } from "zod";
var contactMethodValueSchema = z.string().transform((s, ctx) => {
  const item = ContactMethod.tryFromValue(s);
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
  email: z.string().email().optional(),
  phone: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  intervalDays: z.number().int().min(1).max(365),
  paused: z.boolean().optional(),
  snoozedUntil: z.string().datetime().optional(),
  nextDueAt: z.string().datetime().optional(),
  lastTouchedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});
var touchSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  contactId: z.string().uuid(),
  method: contactMethodValueSchema,
  message: z.string().trim().optional(),
  outcome: z.string().trim().optional(),
  createdAt: z.string().datetime().optional()
});
var userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  dailyGoal: z.number().int().min(0).max(500)
});
var upsertContactSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  firstName: z.string().min(1).max(200).optional(),
  lastName: z.string().min(1).max(200).optional(),
  preferredMethod: contactMethodValueSchema.optional(),
  email: z.string().email().optional(),
  phone: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  paused: z.boolean().optional(),
  snoozedUntil: z.string().datetime().optional(),
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

// src/repositories/mappers.ts
import { reviveSmartEnums, serializeSmartEnums } from "smart-enums";
var createMappers = () => ({
  // Database to Entity (internal use)
  toContactEntity: (dto) => reviveSmartEnums(dto, {
    preferredMethod: ContactMethod
  }),
  toTouchEntity: (dto) => dto ? reviveSmartEnums(dto, {
    method: ContactMethod
  }) : void 0,
  // Entity to DTO (for API responses)
  toContactDTO: (entity) => serializeSmartEnums(entity),
  toTouchDTO: (entity) => serializeSmartEnums(entity),
  toContactListDTO: (entities) => {
    return entities.map(serializeSmartEnums);
  },
  // DTO to Entity (for API requests)
  toContactDTOPartial: (entity) => serializeSmartEnums(entity),
  toTouchDTOPartial: (entity) => serializeSmartEnums(entity)
});

// src/services/authService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var createAuthService = ({ connection: connection2 }) => {
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
  const JWT_EXPIRES_IN = "30d";
  return {
    login: async (credentials) => {
      const { email, password } = credentials;
      const user = await connection2("users").where({ email }).first();
      if (!user || !user.passwordHash) {
        return null;
      }
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return null;
      }
      await connection2("users").where({ id: user.id }).update({ lastLoginAt: (/* @__PURE__ */ new Date()).toISOString() });
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      return { user, token };
    },
    verifyToken: async (token) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await connection2("users").where({ id: decoded.userId }).first();
        if (!user) {
          return null;
        }
        return user;
      } catch (err) {
        return null;
      }
    },
    hashPassword: async (password) => {
      return bcrypt.hash(password, 12);
    },
    comparePassword: async (password, hash) => {
      return bcrypt.compare(password, hash);
    }
  };
};

// src/services/importService.ts
var createImportService = ({
  contactRepository
}) => ({
  importContacts: async (userId, rows) => {
    let inserted = 0;
    let skipped = 0;
    for (const row of rows) {
      if (!row.firstName || !row.lastName) {
        skipped++;
        continue;
      }
      try {
        const contactData = {
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email || void 0,
          phone: row.phone || void 0,
          notes: row.notes || void 0,
          preferredMethod: ContactMethod.email.value,
          // Default to email
          suggestion: "Hi {{firstName}}, just checking in to see how you're doing.",
          intervalDays: 30,
          // Default interval
          paused: false
        };
        await contactRepository.createContact(userId, contactData);
        inserted++;
      } catch (error) {
        console.error("Error importing contact:", error);
        skipped++;
      }
    }
    return { inserted, skipped };
  }
});

// src/middleware/authMiddleware.ts
var createAuthMiddleware = ({ authService }) => {
  return async (ctx, next) => {
    const authHeader = ctx.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ctx.status = 401;
      ctx.body = { error: "Authorization header required" };
      return;
    }
    const token = authHeader.substring(7);
    const user = await authService.verifyToken(token);
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: "Invalid or expired token" };
      return;
    }
    ctx.user = user;
    await next();
  };
};
var createOptionalAuthMiddleware = ({ authService }) => {
  return async (ctx, next) => {
    const authHeader = ctx.get("Authorization");
    ctx.isLoggedIn = false;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const user = await authService.verifyToken(token);
      if (user) {
        ctx.user = user;
        ctx.isLoggedIn = true;
      }
    }
    await next();
  };
};

// src/middleware/smartEnumBodyParser.ts
var createSmartEnumRegistry = () => {
  return {
    ContactMethod
    // Add other smart enum types here as they are created in contracts
  };
};
var createSmartEnumReviver = (registry) => {
  return (key, value) => {
    if (value && typeof value === "object" && "__smart_enum_type" in value && "value" in value) {
      const { __smart_enum_type, value: v } = value;
      const enumClass = registry[__smart_enum_type];
      return enumClass?.tryFromValue(v) ?? value;
    }
    return value;
  };
};

// src/controllers/authController.ts
var createAuthController = ({
  authService
}) => ({
  login: async (ctx) => {
    const { email, password } = ctx.request.body;
    if (!email || !password) {
      ctx.status = 400;
      ctx.body = { error: "Email and password are required" };
      return ctx;
    }
    const result = await authService.login({ email, password });
    if (!result) {
      ctx.status = 401;
      ctx.body = { error: "Invalid email or password" };
      return ctx;
    }
    ctx.status = 200;
    ctx.body = {
      user: result.user,
      token: result.token
    };
    return ctx;
  },
  logout: (ctx) => {
    ctx.status = 200;
    ctx.body = { message: "Logged out successfully" };
    return ctx;
  },
  me: (ctx) => {
    const user = ctx.user;
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: "Not authenticated" };
      return ctx;
    }
    ctx.status = 200;
    ctx.body = { user };
    return ctx;
  }
});

// src/controllers/contactsController.ts
var createContactsController = ({
  contactRepository,
  importService
}) => ({
  getContacts: async (ctx) => {
    const userId = ctx.user.id;
    const entities = await contactRepository.listContacts(userId, {
      /* dueOnly, q parsed elsewhere if needed */
    });
    ctx.status = 200;
    ctx.body = { contacts: entities };
    return ctx;
  },
  getContact: async (ctx) => {
    const userId = ctx.user.id;
    const contactId = ctx.params.id;
    const entity = await contactRepository.getContact(userId, contactId);
    if (!entity) {
      ctx.status = 404;
      ctx.body = { error: "Contact not found" };
      return ctx;
    }
    ctx.status = 200;
    ctx.body = entity;
    return ctx;
  },
  createContact: async (ctx) => {
    const parsed = upsertContactSchema.safeParse(ctx.request.body);
    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = {
        error: "Invalid request format",
        issues: parsed.error.issues
      };
      return ctx;
    }
    const body = parsed.data;
    const userId = ctx.user.id;
    const entity = await contactRepository.createContact(userId, {
      ...body,
      preferredMethod: body.preferredMethod ?? ContactMethod.email.value
    });
    ctx.status = 201;
    ctx.body = entity;
    return ctx;
  },
  patchContact: async (ctx) => {
    const parsed = upsertContactSchema.safeParse(ctx.request.body);
    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = {
        error: "Invalid request format",
        issues: parsed.error.issues
      };
      return ctx;
    }
    const body = parsed.data;
    const userId = ctx.user.id;
    const entity = await contactRepository.patchContact(userId, ctx.params.id, body);
    if (!entity) {
      ctx.status = 404;
      ctx.body = { error: "Contact not found" };
      return ctx;
    }
    ctx.status = 200;
    ctx.body = entity;
    return ctx;
  },
  importContacts: async (ctx) => {
    const body = ctx.request.body;
    if (!body.rows || !Array.isArray(body.rows)) {
      ctx.status = 400;
      ctx.body = { error: "Invalid request format. Expected { rows: ImportRow[] }" };
      return ctx;
    }
    const userId = ctx.user.id;
    const result = await importService.importContacts(userId, body.rows);
    ctx.status = 200;
    ctx.body = result;
    return ctx;
  }
});

// src/controllers/planController.ts
var createPlanController = ({
  planRepository,
  mappers
}) => ({
  getDailyPlan: async (ctx) => {
    const userId = ctx.user.id;
    const contacts = await planRepository.getDailyPlan(userId);
    ctx.body = contacts.map(mappers.toContactDTO);
    return ctx;
  }
});

// src/controllers/touchesController.ts
var createTouchesController = ({
  touchesRepository
}) => ({
  createTouch: async (ctx) => {
    const userId = ctx.user.id;
    const touchData = ctx.request.body;
    const touch = await touchesRepository.createTouch(userId, touchData);
    if (!touch) {
      ctx.status = 404;
      ctx.body = { error: "Contact not found" };
      return ctx;
    }
    ctx.status = 201;
    ctx.body = touch;
    return ctx;
  }
});

// src/controllers/userController.ts
var createUserController = ({
  userRepository
}) => ({
  getMe: async (ctx) => {
    const user = await userRepository.getUser(ctx.user.id);
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: "User not found" };
      return ctx;
    }
    ctx.body = user;
    return ctx;
  },
  updateDailyGoal: async (ctx) => {
    const { dailyGoal } = ctx.request.body;
    const user = await userRepository.updateDailyGoal(ctx.user.id, dailyGoal);
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: "User not found" };
      return ctx;
    }
    ctx.body = user;
    return ctx;
  }
});

// src/routes/authRoutes.ts
var createAuthRoutes = ({
  authController
}) => ({
  mountRoutes: (router2) => {
    router2.post("/auth/login", authController.login);
    router2.post("/auth/logout", authController.logout);
    router2.get("/auth/me", authController.me);
  }
});

// src/middleware/routeGuards.ts
var requireAuth = (controller) => {
  return async (ctx) => {
    if (!ctx.isLoggedIn) {
      ctx.status = 401;
      ctx.body = { error: "Authentication required" };
      return;
    }
    await controller(ctx);
  };
};

// src/routes/contactRoutes.ts
var createContactRoutes = ({
  contactsController
}) => ({
  mountRoutes: (router2) => {
    router2.get("/contacts", requireAuth(contactsController.getContacts));
    router2.get("/contacts/:id", requireAuth(contactsController.getContact));
    router2.post("/contacts", requireAuth(contactsController.createContact));
    router2.patch("/contacts/:id", requireAuth(contactsController.patchContact));
    router2.post("/contacts/import", requireAuth(contactsController.importContacts));
  }
});

// src/routes/index.ts
var createRoutes = ({
  userRoutes,
  contactRoutes,
  planRoutes,
  touchesRoutes,
  authRoutes
}) => ({
  mountRoutes: (router2) => {
    authRoutes.mountRoutes(router2);
    userRoutes.mountRoutes(router2);
    contactRoutes.mountRoutes(router2);
    planRoutes.mountRoutes(router2);
    touchesRoutes.mountRoutes(router2);
  }
});

// src/routes/planRoutes.ts
var createPlanRoutes = ({
  planController
}) => ({
  mountRoutes: (router2) => {
    router2.get("/plan", requireAuth(planController.getDailyPlan));
  }
});

// src/routes/touchesRoutes.ts
var createTouchesRoutes = ({
  touchesController
}) => ({
  mountRoutes: (router2) => {
    router2.post("/touches", requireAuth(touchesController.createTouch));
  }
});

// src/routes/userRoutes.ts
var createUserRoutes = ({
  userController
}) => ({
  mountRoutes: (router2) => {
    router2.get("/me", requireAuth(userController.getMe));
    router2.put("/me/daily-goal", requireAuth(userController.updateDailyGoal));
  }
});

// src/container.ts
var container = createContainer({
  injectionMode: "PROXY"
});
container.register({
  connection: asValue(database)
});
container.register({
  authService: asFunction(createAuthService),
  importService: asFunction(createImportService)
});
container.register({
  authMiddleware: asFunction(createAuthMiddleware),
  optionalAuthMiddleware: asFunction(createOptionalAuthMiddleware),
  smartEnumRegistry: asFunction(createSmartEnumRegistry),
  smartEnumReviver: asFunction(createSmartEnumReviver).inject(() => ({
    registry: "smartEnumRegistry"
  }))
});
container.register({
  mappers: asFunction(createMappers)
});
container.register({
  // Repository instances
  userRepository: asFunction(createUserRepository),
  contactRepository: asFunction(createContactRepository),
  planRepository: asFunction(createPlanRepository),
  touchesRepository: asFunction(createTouchesRepository),
  suggestionRepository: asFunction(createSuggestionRepository)
});
container.register({
  // Controller instances
  userController: asFunction(createUserController),
  contactsController: asFunction(createContactsController),
  planController: asFunction(createPlanController),
  touchesController: asFunction(createTouchesController),
  authController: asFunction(createAuthController)
});
container.register({
  userRoutes: asFunction(createUserRoutes),
  contactRoutes: asFunction(createContactRoutes),
  planRoutes: asFunction(createPlanRoutes),
  touchesRoutes: asFunction(createTouchesRoutes),
  authRoutes: asFunction(createAuthRoutes),
  routes: asFunction(createRoutes)
});

// src/middleware/errorHandler.ts
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

// src/middleware/requestLogger.ts
async function requestLogger(ctx, next) {
  console.log("REQ", ctx.method, ctx.path);
  await next();
  console.log("RES", ctx.status, ctx.path);
}

// src/koaServer.ts
dotenv2.config();
var app = new Koa();
app.context.db = database;
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
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8080",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);
var smartEnumReviver = container.resolve("smartEnumReviver");
app.use(koaBody({ customReviver: smartEnumReviver }));
var routes = container.resolve("routes");
var optionalAuthMiddleware = container.resolve("optionalAuthMiddleware");
var router = new Router({ prefix: "/api" });
routes.mountRoutes(router);
app.use(optionalAuthMiddleware);
app.use(router.routes()).use(router.allowedMethods());
var server = http.createServer(app.callback());

// src/index.ts
var PORT = process.env.PORT || 3e3;
server.listen(PORT, () => {
  console.log(`\u{1F680} Server running on http://localhost:${PORT}`);
});
