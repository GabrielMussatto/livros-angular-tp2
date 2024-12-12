import { Sexo } from "./sexo.model";
import { Telefone } from "./telefone.model";

export class Usuario{
    id!: number;
    nome!: string;
    username!: string;
    perfil!: number;
    senha!: string;
    dataNascimento!: Date;
    email!: string;
    cpf!: string;
    telefone!: Telefone[];
    idSexo!: Sexo;
}