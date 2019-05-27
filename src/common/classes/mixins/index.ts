export { EventEmitter } from "./event_emitter";

// Create a reference to the abstract class deabstractifier utility function.
import { ReflectionUtils } from "@/utilities";
export const _ = ReflectionUtils.deabstractifyClass;
