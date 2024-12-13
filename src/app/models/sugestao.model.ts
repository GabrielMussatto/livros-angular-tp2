import { Cliente } from "./cliente.model";

export class Sugestao {
    idSugestao!: number;
    sugestao!: string;
    dataSugestao!: Date;
    cliente!: Cliente;
}
