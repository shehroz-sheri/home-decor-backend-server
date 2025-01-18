import "reflect-metadata";
import { createYoga } from "graphql-yoga";
import { schema } from "../src/graphql/schema/schema";
import prisma from "../src/config/prisma";
import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";

const app = express();

const publicDir = path.join(__dirname, "../public");
app.use(express.static(publicDir));

// Handle the root route to serve index.html
app.get("/", (req, res) => {
  const filePath = path.join(publicDir, "index.html");
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).send("Error loading the page.");
    }
  });
});

const yoga = createYoga({
  schema,
  context: () => ({
    prisma,
  }),
  landingPage: false,
});

app.use("/graphql", yoga);

const PORT = process.env.PORT || 4000;
const server = createServer(app);

server.listen(PORT);
