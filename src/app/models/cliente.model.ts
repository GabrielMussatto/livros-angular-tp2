import { Livro } from "./livro.model";
import { Usuario } from "./usuario.model";

export class Cliente{
    id!: number;
    usuario!: Usuario;
    cep!: string;
    endereco!: string;
    estado!: string;
    sigla!: string;
    cidade!: string;
    listaFavorito?: number[];
    listaFavoritoCaixaLivro?: number[];
    listaSugestao?: string[];
}