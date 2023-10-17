# App

GymPass style app.

## RFs (Requisitos funcionais) - funcionalidades da aplicação; o que o usuário pode fazer na aplicação
- [X] Deve ser possível se cadastrar;
- [X] Deve ser possível se autenticar;
- [X] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [X] Deve ser possível o usuário obter seu histórico de check-ins;
- [ ] Deve ser possível o usuário buscar academias próimas (até 10km);
- [X] Deve ser possível o usuário buscar academias pelo nome;
- [X] Deve ser possível o usuário realizar o check-in em uma academia;
- [ ] Deve ser possível validar o check-in de um usuário;
- [X] Deve ser possível cadastrar uma academia;

## RNs (Regra de Negócio) - defini como as funcionalidades devem reagir - sempre estão ligadas a um RF
- [X] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [X] O usuário não pode fazer 2 check-ins no mesmo dia;
- [X] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após ser criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs - (Requisito não-funcional) - outros recursos que serão utilizados para a aplicação funcionar
- [X] A senha do usuário precisa estar criptografada;
- [X] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [X] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);
## Resource

## Techs
- Node
- Typescript
- tsx
- tsup

- vitest

## Designs Patterns and Methodology
- Dependecy Inection
- Repository
- Factory
- TDD