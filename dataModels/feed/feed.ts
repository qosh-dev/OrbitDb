import { createConnection } from "../Connection";

createConnection((orbitDb) => {
  return {
    users: orbitDb.feed("users"),
    posts: orbitDb.feed("posts"),
  };
}).then(async (repository) => {
  const users = await repository.users;

  await users.add({ name: "User1" });

  const all = users.iterator({ limit: -1 }).collect();
  console.log(all[0].payload.value);
});
