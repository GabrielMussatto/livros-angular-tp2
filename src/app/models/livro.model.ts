import { Autor } from "./autor.model";
import { Classificacao } from "./classificacao.model";
import { Editora } from "./editora.model";
import { Fornecedor } from "./fornecedor.model";
import { Genero } from "./genero.model";

export class Livro {
    id!: number;
    titulo!: string;
    descricao!: string;
    quantidadeEstoque!: number;
    isbn!: string;
    preco!: number;
    classificacao!: Classificacao;
    fornecedor!: Fornecedor;
    editora!: Editora;
    datalancamento!: Date;
    generos!: Genero[];
    autores!: Autor[];
    nomeImagem!: string;
}
