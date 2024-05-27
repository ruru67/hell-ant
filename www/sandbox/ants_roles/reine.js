import { Role } from "./role.js"
import { Pondre } from "../etats/pondre.js"

export class Reine extends Role{
    static name="reine"
    static scale=1.2
    static color=0xfe0e000
    static selectLineWidth=2
    static etats_possibles_role=[
        Pondre
    ]
}