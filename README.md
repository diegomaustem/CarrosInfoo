🚀 COMO EXECUTAR O PROJETO

    PRÉ-REQUISITOS
    
    Docker instalado
    
    Docker Compose

📥 CLONAR E EXECUTAR

    1. Clone o projeto do repositório

      # git clone git@github.com:diegomaustem/CarrosInfoo.git

    2. Entre na pasta raiz do projeto
    
      # cd CarrosInfoo
    
    3. Crie e execute os containers com o comando abaixo
          
      # docker-compose up --build
      
🔗 ACESSO À APLICAÇÃO
    
    🌐 Frontend: http://localhost:4200/

    ⚡ API Backend: http://localhost:3007/veiculos

    📚 Swagger Docs: http://localhost:3007/api

🧪 EXECUTAR TESTES

    EXECUTAR TODOS OS TESTES
    
    # Dentro da pasta raiz do projeto execute o comando abaixo 
    
    # docker-compose exec backend npm test
    
🧪 EXECUTAR TESTES ESPECÍFICOS

    # Dentro da pasta raiz do projeto execute os comandos abaixo 

    # Testes do Service
    docker-compose exec backend npm test -- src/vehicles/__tests__/vehicles.service.spec.ts

    # Testes do Controller
    docker-compose exec backend npm test -- src/vehicles/__tests__/vehicles.controller.spec.ts

    # Testes do Repository
    docker-compose exec backend npm test -- src/vehicles/__tests__/vehicles.repository.spec.ts


🔧 COMANDOS ÚTEIS

    # Parar todos os serviços
    docker-compose down

    # Executar em background
    docker-compose up -d --build

    # Ver logs
    docker-compose logs -f
    
    # Ver status
    docker-compose ps
    

📦 TECNOLOGIAS

    # Frontend: Angular 17
    
    # Backend: NestJS + Prisma
    
    # Database: PostgreSQL
    
    # Container: Docker
    
    # Testes: Jest

🎯 VERIFICAÇÃO FINAL

    # Teste o backend
    curl http://localhost:3007/veiculos

    # Teste o frontend
    curl http://localhost:4200

    # Verifique os logs
    docker-compose logs
Pronto! Sua aplicação estará rodando perfeitamente! 🚗✨
