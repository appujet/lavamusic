module.exports = {
    apps: [
        {
            namespace: "lavamusic",
            name: "bot",
            script: "npm run start",
            exec_mode: "cluster",
            instances: 1,
            autorestart: true,
            cwd: ".",
            watch: "."
        }
    ]
};