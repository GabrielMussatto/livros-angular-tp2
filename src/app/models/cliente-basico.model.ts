import { Sexo } from "./sexo.model";
import { Telefone } from "./telefone.model";

export class ClienteBasico {
    id!: number;
    nome!: string;
    username!: string;
    perfil!: number;
    senha!: string;
    dataNascimento!: Date;
    email!: string;
    cpf!: string;
    telefone!: Telefone;
    idSexo!: Sexo;
    cep!: string;
    endereco!: string;
    estado!: string;
    sigla!: string;
    cidade!: string;
    listaFavorito?: number[];
    listaFavoritoCaixaLivro?: number[];
    listaSugestao?: string[];
}
