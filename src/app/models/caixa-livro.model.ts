import { Autor } from "./autor.model";
import { Editora } from "./editora.model";
import { Fornecedor } from "./fornecedor.model";
import { Genero } from "./genero.model";

export class CaixaLivro {
    id!: number;
    nome!: string;
    descricao!: string;
    quantidadeEstoque!: number;
    fornecedor!: Fornecedor;
    editora!: Editora;
    //generos!: Genero[];
    //autores!: Autor[];
    classificacao!: string;
    //fazer preco depois
}
