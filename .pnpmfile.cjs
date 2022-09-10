module.exports = {
    hooks: {
        afterAllResolved: (lockfile, context) => {
            require("./psv/hook").hook(lockfile);
        },
    },
};
