const packagePath = import.meta.url
    .replace("file://", "")
    .replace("util/path.js", "");

export { packagePath };
