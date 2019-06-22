import Waterline from "waterline";

const database: Waterline.Waterline = new Waterline();

// mongodb://user:password@host:port/database

database.initialize({
    adapters: {
        mongo: require("sails-mongo"),
    },

    connections: {
        default: {
            adapter: "mongo",
            database: "",
            host: "",
            user: "",
        },
    },
} as Waterline.Config, (error, ontology) => {
    return;
});
