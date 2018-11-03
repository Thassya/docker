ID=$1
docker run -i -t -d --name gccalpine$1 gcc && docker start gccalpine$1


docker exec -i gccalpine$1 sh -c "echo """" > /home/compiler/output/retorno.txt && echo """" > /home/compiler/output/validacao.txt" 


docker cp /tmp/input$1.c gccalpine$1:/home/compiler/input/input.c && 
docker cp timeout_script.sh gccalpine$1:/home/compiler/input/timeout_script.sh && 
docker cp stdin.txt gccalpine$1:/home/compiler/input/stdin.txt && 
docker cp createjson_script.sh gccalpine$1:/home/compiler/input/createjson_script.sh

# da permissões de escrita para o arquivo
docker exec -i gccalpine$1 sh -c "chmod u+x /home/compiler/input/timeout_script.sh && chmod u+x /home/compiler/input/createjson_script.sh" 

# cria executavel com o gcc e armazena possíveis erros de compilação.. 
docker exec -i gccalpine$1 sh -c "if gcc -Wall -Wextra -std=c99 -D_GNU_SOURCE /home/compiler/input/input.c -o /home/compiler/input/input_compiled$1; then printf ""sim"" >> /home/compiler/output/stdout_temp.txt && ./home/compiler/input/timeout_script.sh $1; else printf ""nao"" >> /home/compiler/output/stdout_temp.txt; fi"

# executa o arquivo! 

docker exec -i gccalpine$1 sh -c "./home/compiler/input/createjson_script.sh"

# para o docker e copia os arquivos de resultados para o servidor que chamou... 
# $PWD CAMINHO RELATIVO -> /tmp/docker/
docker stop gccalpine$1  && 
docker cp gccalpine$1:/home/compiler/output/stdout.txt /tmp/stdout$1.json && 
docker rm gccalpine$1
