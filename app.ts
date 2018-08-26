import "module-alias/register";
import * as Discord from "discord.js";
import * as $Utilities from "util";

import * as Doppelgangster from "@";
import * as Utilities from "@/Utilities";
import Logger from "@/Logger";


Logger.info(`Versions: Node.js ${process.version.slice(1)}, discord.js ${Discord.version}`);
process.on("uncaughtException", (error: Error) =>
	Logger.warn("Uncaught exception:", Utilities.Miscellaneous.stringifyError(error))
).on("unhandledRejection", (error: Error, promise: Promise<any>) =>
	Logger.warn("Unhandled promise rejection:", Utilities.Miscellaneous.stringifyError(error), $Utilities.inspect(promise))
);
Doppelgangster.initialize();

(() => {
	return;
	const applyInConstructor: boolean = true; // Choose when the mix-ins are applied


	/**
	 * Mix-in classes
	 */

	class A {
		a: number = 1; // Property field
		aMethod(): void { console.log("I am in A: a =", this.a); }
	}

	abstract class B {
		get b(): number { return 2; } // Getter
		bMethod(): void { console.log("I am in B: b =", this.b); }
	}

	class C {
		constructor(public c: number) {}
		cMethod(): void { console.log("I am in C: c =", this.c); }
	}

	abstract class D {
		constructor(public d: number) {}
		dMethod(): void { console.log("I am in D: d =", this.d); }
	}


	/**
	 * Class to apply mix-ins to
	 */

	class X implements A, B, C, D {
		// Mix-ins
		/* A */ a!: typeof A.prototype.a; aMethod!: typeof A.prototype.aMethod;
		/* B */ b!: typeof B.prototype.b; bMethod!: typeof B.prototype.bMethod;
		/* C */ c!: typeof C.prototype.c; cMethod!: typeof C.prototype.cMethod;
		/* D */ d!: typeof D.prototype.d; dMethod!: typeof D.prototype.dMethod;

		// Normal class properties and methods
		x: number = 4;
		xMethod(): void { console.log("I am in X: a + b + c + d + Math.PI =", this.x); }

		constructor(dNumber?: number) {
			// Apply mix-ins to a class instance from within its constructor
			if (applyInConstructor)
				Utilities.Class.mixIn(this, [
					A, // Normal class
					B, // Abstract class
					new C(3), // Class instance
					[D, dNumber] // Normal/abstract class with constructor arguments
				]);
			
			this.x = this.a + this.b + this.c + this.d + this.x; // At this point, all mix-in fields are accessible
		}
	}

	// Apply mix-ins to the class itself
	if (!applyInConstructor)
		Utilities.Class.mixIn(X, [
			A, // Normal class
			B, // Abstract class
			new C(3), // Class instance
			[D, Math.PI] // Normal/abstract class with constructor arguments
		]);


	/**
	 * Test mix-in properties and methods
	 */

	const x: X = applyInConstructor ? new X(Math.PI) : new X();

	// Mix-ins from class A
	console.log("a =", x.a); // a = 1
	x.aMethod(); // I am in A: a = 1

	// Mix-ins from class B
	console.log("b =", x.b); // b = 2
	x.bMethod(); // I am in B: b = 2

	// Mix-ins from class C
	console.log("c =", x.c); // c = 3
	x.cMethod(); // I am in C: c = 3

	// Mix-ins from class D
	console.log("d =", x.d); // d = 3.141592653589793
	x.dMethod(); // I am in D: d = 3.141592653589793

	// Class X's own fields
	console.log("x =", x.x); // x = 13.141592653589793
	x.xMethod(); // I am in X: a + b + c + d + Math.PI = 13.141592653589793


	/**
	 * mixIn argument type assertion tests - checks TypeScript's linter; uncomment to check
	 * - Argument 1 can only be a class or an instance
	 * - Argument 2 can only be an array of a class, an instance, or an array of the type [class, ...class_constructor_args]
	 */
	
	// Valid
	Utilities.Class.mixIn(X, [A, B]); // Mix class properties into a class
	Utilities.Class.mixIn(new X(), [A, B]); // Mix class properties into an instance
	Utilities.Class.mixIn(B, [A, B, new C(0)]); // Mix instance properties into a class
	Utilities.Class.mixIn(new X(), [A, B, new C(0), [D, 0]]); // Mix instance properties into an instance; constructs class D with argument array [0]
	
	// Invalid argument 1 (base); similar constraints apply to argument 2 (mix-ins)
	/*Utilities.Class.mixIn({}, [A, B]); // Generic object; caught at runtime since there's no way to differentiate it between a class instance at compile time
	Utilities.Class.mixIn([], [A, B]); // Array; caught at compile-time
	Utilities.Class.mixIn("", [A, B]); // String; caught at compile-time
	Utilities.Class.mixIn(0, [A, B]); // Number; caught at compile-time
	Utilities.Class.mixIn(true, [A, B]); // Boolean; caught at compile-time
	Utilities.Class.mixIn(Symbol.toStringTag, [A, B]); // Symbol; caught at compile-time
	Utilities.Class.mixIn(null, [A, B]); // Null; caught at compile-time if strictNullChecks is true; otherwise caught at runtime
	Utilities.Class.mixIn(undefined, [A, B]); // Undefined; caught at compile-time if strictNullChecks is true; otherwise caught at runtime*/
})();