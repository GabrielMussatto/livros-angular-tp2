import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Usuario } from '../../../models/usuario.model';
import { Cliente } from '../../../models/cliente.model';
import { Subscription } from 'rxjs';
import { Sexo } from '../../../models/sexo.model';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatInputModule,
    FormsModule,
    MatDivider,
    RouterModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './cliente-perfil.component.html',
  styleUrl: './cliente-perfil.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientePerfilComponent implements OnInit {
  formGroup: FormGroup;
  usuarioLogado: any;
  endereco: any;
  usuario: Usuario | null = null;
  cliente: Cliente | null = null;
  private subscription = new Subscription();
  fileName: string = '';
  hide = signal(true);
  sexos: Sexo[] = [];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private clienteService: ClienteService
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      dataNascimento: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      cpf: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ]),
      ],
      telefone: this.formBuilder.group({
        codigoArea: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(3),
          ]),
        ],
        numero: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
          ]),
        ],
      }),
      sexo: [null, Validators.required],
    });
  }

  initializeForm(): void {
    const cliente: Cliente =
      this.activeRoute.snapshot.data['cliente'] ||
      ({ usuario: {}, telefone: {} } as unknown as Cliente);
    console.log('Cliente recebido: ', cliente);

    const sexo =
      this.sexos.find((s) => s.id === cliente?.usuario?.idSexo?.id) || null;

    this.formGroup = this.formBuilder.group({
      id: [cliente?.usuario?.id || null],
      nome: [
        cliente?.usuario?.nome || '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      username: [
        cliente?.usuario?.username || '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      dataNascimento: [
        cliente?.usuario?.dataNascimento || '',
        Validators.compose([Validators.required]),
      ],
      email: [
        cliente?.usuario?.email || '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      cpf: [
        cliente?.usuario?.cpf || '',
        Validators.compose([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ]),
      ],
      telefone: this.formBuilder.group({
        codigoArea: [
          cliente?.usuario?.telefone?.codigoArea || '',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(3),
          ]),
        ],
        numero: [
          cliente?.usuario?.telefone?.numero || '',
          Validators.compose([
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(10),
          ]),
        ],
      }),
      sexo: [sexo, Validators.required],
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((cliente) => {
        this.usuarioLogado = cliente;
        this.cliente = cliente; // Atualiza o cliente quando os dados forem carregados
        this.initializeForm(); // Recria o formulário com os dados carregados
      })
    );
    const usuarioLogado1 = localStorage.getItem('usuario_logado');
    if (usuarioLogado1) {
      const cliente = JSON.parse(usuarioLogado1);
      this.clienteService.meuPerfil(cliente.id).subscribe({
        next: (dadosCliente) => {
          this.endereco = {
            codigoArea: dadosCliente.usuario.telefone?.codigoArea,
            numero: dadosCliente.usuario.telefone?.numero,
            username: dadosCliente.usuario.username,
            cep: dadosCliente.cep,
            endereco: dadosCliente.endereco,
            estado: dadosCliente.estado,
            sigla: dadosCliente.sigla,
            cidade: dadosCliente.cidade,
          };
        },
        error: (err) => console.error('Erro ao carregar o endereço:', err),
      });
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
