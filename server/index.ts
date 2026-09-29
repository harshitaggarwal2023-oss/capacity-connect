import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import { jwtVerify } from "jose";
import { prisma } from "../lib/prisma";

const app = express();
const httpServer = createServer(app);
const redisUrl = process.env.REDIS_URL;

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true,
  },
});

if (redisUrl && redisUrl !== "redis://localhost:6379") {
  try {
    const pubClient = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
    const subClient = pubClient.duplicate();
    pubClient.on("error", () => {});
    subClient.on("error", () => {});
    io.adapter(createAdapter(pubClient, subClient));
  } catch (err) {
    console.warn("Using built-in memory adapter for Socket.io");
  }
} else {
  console.log("Socket.io running with built-in memory adapter");
}

// JWT handshake authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      // In development / demo environments allow anonymous or development mock user if token omitted
      if (process.env.NODE_ENV !== "production") {
        (socket as any).userId = "demo-user";
        (socket as any).role = "TRAINEE";
        return next();
      }
      return next(new Error("Unauthorized: Token missing"));
    }
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev");
    const { payload } = await jwtVerify(token, secret);
    (socket as any).userId = payload.id;
    (socket as any).role = payload.role;
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      (socket as any).userId = "dev-user";
      (socket as any).role = "TRAINEE";
      return next();
    }
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = (socket as any).userId as string;
  const role = ((socket as any).role || "TRAINEE").toLowerCase();

  // Join private rooms
  socket.join(`user:${userId}`);
  socket.join(`role:${role}`);

  // Join course room
  socket.on("join_course", (courseId: string) => {
    socket.join(`course:${courseId}`);
  });

  // Real-time direct messaging between users
  socket.on("send_message", async (data: { receiverId: string; content: string; roomId: string }) => {
    try {
      const msg = await prisma.message.create({
        data: {
          senderId: userId,
          receiverId: data.receiverId,
          content: data.content,
          roomId: data.roomId,
        },
      });

      // Emit to receiver and sender confirmation
      io.to(`user:${data.receiverId}`).emit("new_message", msg);
      socket.emit("new_message", msg);
      if (data.roomId) {
        io.to(`course:${data.roomId}`).emit("new_message", msg);
      }
    } catch (e) {
      socket.emit("message_error", { error: "Failed to persist message" });
    }
  });

  // Admin platform broadcast
  socket.on("admin_broadcast", (data: { message: string; target: "trainee" | "trainer" | "all" }) => {
    const userRole = (socket as any).role;
    if (userRole !== "ADMIN") return;

    const payload = {
      type: "ADMIN_ANNOUNCEMENT",
      content: data.message,
      createdAt: new Date().toISOString(),
    };

    if (data.target === "all") {
      io.to("role:trainee").to("role:trainer").emit("new_notification", payload);
    } else {
      io.to(`role:${data.target}`).emit("new_notification", payload);
    }
  });

  socket.on("disconnect", () => {
    // Left rooms automatically
  });
});

app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`CAPACITY CONNECT Real-time Socket.io server running on port ${PORT}`);
});
