printf "{\"output\":{\"compilado\":\"" > /home/compiler/output/stdout.txt

 printf "\",\"retorno\":\"" | cat - /home/compiler/output/retorno.txt >> /home/compiler/output/stdout_temp.txt && printf "\",\"validacao\":\"" | cat - /home/compiler/output/validacao.txt >> /home/compiler/output/stdout_temp.txt && printf "\"}}" >> /home/compiler/output/stdout_temp.txt

# grep -v '^$' /home/compiler/output/stdout_temp.txt >> 

tr '\n' ' ' < /home/compiler/output/stdout_temp.txt >> /home/compiler/output/stdout.txt
