import { Autor } from "./autor.model";

export interface ItemFavorito {
    id: number;
    tipo: 'Livro' | 'CaixaLivro';
    nome: string;
    preco: number;
    autores?: Autor[];
    imagemUrl?: string;
}
