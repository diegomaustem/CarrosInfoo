import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VeiculosService, Veiculo } from '../services/veiculos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit, OnDestroy {
  veiculos: Veiculo[] = [];
  carregando: boolean = false;
  erro: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private veiculosService: VeiculosService) {}

  ngOnInit() {
    this.listarVeiculos();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  listarVeiculos() {
    this.carregando = true;
    this.erro = '';

    const sub = this.veiculosService.listarVeiculos().subscribe({
      next: (veiculos) => {
        this.veiculos = veiculos;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar veículos:', error);
        this.erro = 'Erro ao carregar veículos. Tente novamente.';
        this.carregando = false;
      },
    });

    this.subscription.add(sub);
  }
}
