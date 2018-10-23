ID=$1
docker run -i -t -d --name gcc_compiler$1 gcc && docker start gcc_compiler$1

# criando arquivos com os retornos
 docker exec -i gcc_compiler$1 sh -c "echo """" > /home/compiler/output/compilacao.txt && echo """" > /home/compiler/output/errovalidacao.txt && echo """" > /home/compiler/output/saida.txt && echo """" > /home/compiler/output/timeout.txt" 

# copia pro Docker
docker cp input$1.c gcc_compiler$1:/home/compiler/input/input.c && 
docker cp timeout_script.sh gcc_compiler$1:/home/compiler/input/timeout_script.sh && 
docker cp stdin.txt gcc_compiler$1:/home/compiler/input/stdin.txt 

# permissões
docker exec -i gcc_compiler$1 sh -c "chmod u+x /home/compiler/input/timeout_script.sh && chmod u+x /home/compiler/input/createjson_script.sh" 

# executa o código
docker exec -i gcc_compiler$1 sh -c "if gcc -Wall -Wextra -std=c99 -D_GNU_SOURCE /home/compiler/input/input.c -o /home/compiler/input/input_compiled$1; then printf ""sim"" >> /home/compiler/output/stdout_temp.txt && ./home/compiler/input/timeout_script.sh $1; else printf ""nao"" >> /home/compiler/output/stdout_temp.txt; fi"


docker stop gcc_compiler$1 && docker rm gcc_compiler$1