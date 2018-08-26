import { post as httpPost } from "request";

// import Logger from "@/Logger";


interface IInterfaceOptions {
	url: string;
	authorization: string;
}

interface IDatabaseOptions {
	host: string;
	username: string;
	password: string;
	databasePrefix?: string;
}


export class DatabaseInterface {
	// Private properties
	private interfaceOptions: IInterfaceOptions;
	private databaseOptions: IDatabaseOptions;


	// Constructor
	constructor(interfaceOptions: IInterfaceOptions, databaseOptions: IDatabaseOptions) {
		this.interfaceOptions = interfaceOptions; this.databaseOptions = databaseOptions;
	}


	// Public methods
	public async query(database: string, query: string, parameters?: object): Promise<any> {
		// Logger.info("Querying:", query);
		return new Promise((resolve, reject) => {
			return httpPost(this.interfaceOptions.url, {
				headers: { Authorization: this.interfaceOptions.authorization },
				form: {
					host: this.databaseOptions.host,
					username: this.databaseOptions.username,
					password: this.databaseOptions.password,
					database: (this.databaseOptions.databasePrefix || "") + database,
					query: query,
					parameters: parameters ? JSON.stringify(parameters) : null
				}
			}, (error, _code, result) => {
				// Logger.info("Error:", error, "Result:", result);
				if (!error)
					resolve(result);
				else
					reject(result);
			});
		});
	}

	public async select(database: string, table: string, columns: string | string[], matchingRecords: object): Promise<any> {
		return this.query(database,
			`SELECT \`${typeof columns === "string" ? columns : columns.join("`, `")}\` FROM \`${table}\` WHERE ` + this.stringifyRecords(matchingRecords, [], " AND ")
		);
	}

	public async insert(database: string, table: string, records: object, duplicateUpdateUniqueKey?: string): Promise<any> {
		return this.query(database,
			`INSERT INTO \`${table}\` (\`${
				Object.keys(records).join("`, `")
			}\`) VALUES ('${
				Object.values(records).join("', '")
			}')${
				duplicateUpdateUniqueKey ? ` ON DUPLICATE KEY UPDATE ` + this.stringifyRecords(records, [duplicateUpdateUniqueKey]) : ""
			}`
		);
	}

	public async update(database: string, table: string, matchingRecords: object, updatedRecords: object): Promise<any> {
		return this.query(database,
			`UPDATE \`${table}\` SET ${this.stringifyRecords(updatedRecords)} WHERE ${this.stringifyRecords(matchingRecords, [], " AND ")}`
		);
	}

	public async delete(database: string, table: string, matchingRecords: object): Promise<any> {
		return this.query(database,
			`DELETE FROM \`${table}\` WHERE ` + this.stringifyRecords(matchingRecords, [], " AND ")
		);
	}


	// Private methods
	private stringifyRecords(records: { readonly [record: string]: any; }, keyExclusions: string[] = [], delimiter: string = ", "): string {
		return Object.keys(records).map(key => keyExclusions.includes(key) ? undefined : `\`${
			key.replace("'", "\'")
		}\` = ${
			typeof records[key] === "string" ? `'${records[key].replace("'", "\'")}'` : records[key]
		}`).filter(record => typeof record !== "undefined").join(delimiter);
	}
}