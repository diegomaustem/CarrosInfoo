import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Veiculo {
  id: string;
  placa: string;
  chassi: string;
  renavam: string;
  modelo: string;
  marca: string;
  ano: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

@Injectable({
  providedIn: 'root',
})
export class VeiculosService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl);
  }

  listarVeiculos(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(this.apiUrl).pipe(
      map((response) => {
        const veiculos = Array.isArray(response) ? response : [];
        return veiculos;
      }),
      catchError((error) => {
        console.error('Erro na API:', error);
        return of([]);
      })
    );
  }
}
