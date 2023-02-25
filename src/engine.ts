import { Engine } from "./interfaces/engine";

export const EngineModes: Record<string, Engine> = {
    problem: {
        input_question: ["div[id*='__next'] div[class*='_1l1MA']"],
        input_code: [".view-lines"],
        sidebarContainer: ["rhs"],
        appendContainer: ["ssg__qd-console-position--right"]
    },
    submission: {
        input_question: ["input[name='']"],
        input_code: ["input[name='']"],
        sidebarContainer: ["#rhs"],
        appendContainer: ["#rcnt"]
    }
}