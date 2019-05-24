import * as Tracer from "tracer";


const Logger: Tracer.Tracer.Logger = Tracer.colorConsole({
    format: "[{{timestamp}}][{{title}}][{{file}}] {{message}}",
    dateformat: "mm/dd HH:MM:ss.l",
    preprocess: data => {
        data.title = data.title.toUpperCase().padStart(5);

        const file: string = data.file.replace(/\.js$/, "");
        data.file = file.length > 20 ? file.slice(0, 19) + "…" : file.padStart(20);
    }
}); export default Logger;

/*format: [
        "[{{timestamp}}][{{title}}][{{file}}] {{message}}",
        {
            error: "[{{timestamp}}][{{title}}][{{file}}][{{line}}:{{pos}}][{{method}}] {{message}}\n{{stack}}"
        }
    ]
    */