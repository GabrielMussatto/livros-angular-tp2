import { Sexo } from "./sexo.model";
import { Telefone } from "./telefone.model";

export class Usuario{
    id!: number;
    username!: string;
    sexo!: Sexo;
    nome!: string;
    telefone!: Telefone;
    email!: string;
    cpf!: string;
    dataNascimento!: Date;
}