import routerS3 from "./modules/s3/routes";
import server from "./server";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

server.get("/", (req, res) => {
    res.send({ message: "Hello, world!" });
});

server.use(routerS3);

server.listen(PORT, () => {
    console.log(`Server is listening on http://${HOST}:${PORT}`);
});