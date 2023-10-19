curl -i localhost:3333/me -X GET -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzQ0MmYyZS1jMjUyLTRjZjctYjg1MS0yN2U1OWNkNzk5N2IiLCJpYXQiOjE2OTc3NDM0Nzd9.rvMrU-AReGJIm8daDYvpOBP-nM-ue-pJxZIGv90RnHI" \
  > scripts/response_profile.txt

cat scripts/response_profile.txt
