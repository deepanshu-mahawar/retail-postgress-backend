import app from "./app";
import { AppDataSource } from "./config/data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(console.error);
