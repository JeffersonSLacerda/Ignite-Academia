curl -i localhost:3333/sessions -X POST -H "Content-Type: application/json" -d '{"email": "jeff@test.com", "password": "123456"}' > scripts/resposta_authenticate.txt

cat scripts/resposta_authenticate.txt
