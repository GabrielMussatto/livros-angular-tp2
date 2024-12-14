import { Cupom } from "./cupom.model";
import { ItemPedido } from "./item-pedido";

export interface Pedido {
    id?: number;
    idCliente: number;
    dataPedido?: string;
    valorTotal?: string;
    itens: ItemPedido[];
    statusPagamento?: string;
    statusPedido?: string;
    cupom?: Cupom;
}
