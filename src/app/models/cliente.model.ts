import { Livro } from "./livro.model";
import { Usuario } from "./usuario.model";

export class Cliente{
    usuario!: Usuario;
    cep!: string;
    endereco!: string;
    cidade!: string;
    estado!: string;
    listaFavorito!: Livro[];
}