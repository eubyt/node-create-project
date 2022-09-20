export default {
    variables: {
        "index.js": {
            import: ["import express from 'express';"],
            var: ["const app = express();"],
            functions: [
                'app.get("/", (req, res) => {',
                '    res.send("Hello World!");',
                "});",
            ],
        },
    },
};
