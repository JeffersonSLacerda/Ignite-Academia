curl -i localhost:3333/users -X POST -H "Content-Type: application/json" -d '{"name": "Jeff", "email": "jeff@test.com", "password": "123456"}' > scripts/resposta_createUser.txt

cat scripts/resposta_createUser.txt
