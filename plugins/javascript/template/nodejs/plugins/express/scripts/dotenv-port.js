function exec(fs, project) {
    const { projectName, dependencies } = project;
    let contentsFile = {
        "server.js": {
            functions: [],
        },
    };

    if (!dependencies.includes("dotenv")) {
        contentsFile["server.js"].functions.push(
            "",
            "app.listen(3000, () => {",
            "    console.log('Example app listening on port 3000');",
            "});"
        );
        return;
    }

    contentsFile["server.js"].functions.push(
        "",
        "app.listen(process.env.PORT, () => {",
        "    console.log(`Example app listening on port ${process.env.PORT}!`);",
        "});"
    );

    // Add line port to .env file
    fs.appendFileSync(`${projectName}/.env`, "\nPORT=3000");

    return { contentsFile };
}

export default exec;
