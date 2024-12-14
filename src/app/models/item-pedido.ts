export interface ItemPedido {
    idLivro?: number; // Caso seja um livro
    idCaixaLivro?: number;   // Caso seja uma caixa de livro
    titulo?: string;
    preco?: number;
    quantidade: number;
    desconto?: number;
    subTotal?: number;
    imageUrl?: string;
}
