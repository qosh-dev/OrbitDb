// import express from "express";
// import * as IPFS from "ipfs-core";
// import OrbitDB from "orbit-db";
import express from "express";
// import { createConnection } from "../Connection";
import { randomUUID } from "crypto";
import { initIPFSInstance } from "../Connection";
const cors = require("cors");
// const express = require("express");
const OrbitDB = require("orbit-db");
const IPFS = require("ipfs");

const Identities = require("orbit-db-identity-provider");

// createConnection((orbitDb) => {
//   return {
//     postsTable: orbitDb.docs("postsTable", {
//       indexBy: "name",
//       replicate: true,
//       accessController: {
//         type: 'ipfs',
//         write: ["*"],
//       },
//     }),
//   };
// })

initIPFSInstance()
  .then(async (ipfs) => {
    const options = { id: "local-id" };
    // const identity = await Identities.createIdentity(options);
    const orbitdb = OrbitDB.createInstance(ipfs);
    //Create or Open DB
    return orbitdb;
  })
  .then((orbitDb) => {
    return {
      postsTable: orbitDb.docs("postsTable", {
        replicate: true,
        accessController: {
          type: "ipfs",
          write: ["*"],
        },
      }),
    };
  })
  .then(async (repository) => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.get("/", async (req, res) => {
      const postsTable = await repository.postsTable;
      const allPosts = postsTable.get("");
      res.json(allPosts);
    });

    app.get("/getAll", async (req, res) => {
      const postsTable = await repository.postsTable;
      const allPosts = postsTable.get("");
      res.json(allPosts);
    });

    app.get("/add", async (req, res) => {
      const postsTable = await repository.postsTable;
      const newEntryHash = await postsTable.put({
        _id: randomUUID(),
        name: "NAME",
      });
      res.json(newEntryHash);
    });

    app.get("/getAddress", async (req, res) => {
      const postsTable = await repository.postsTable;

      res.json(postsTable.address.toString());
    });

    app.listen(8080, async () => {
      const postsTable = await repository.postsTable;

      postsTable.events.on("replicated", async () => {
        console.log("replicated");
        const postsTable = await repository.postsTable;
        console.log(postsTable.get(""));
      });

      postsTable.events.on("write", async () => {
        console.log("write");
        const postsTable = await repository.postsTable;
        console.log(postsTable.get(""));
      });

      console.log("TABLE address", postsTable.address.toString());
      console.log("Identity", postsTable.identity);

      console.log(`Listen on http://localhost:${8080}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
