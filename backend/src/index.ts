import express, { Request, Response } from "express";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

const port = 8000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
