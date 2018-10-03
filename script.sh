ID=$1
docker run -i -t -d --name gcc_compiler$1 gcc
docker start gcc_compiler$1
docker exec -i gcc_compiler$1  sh -c "rm /home/compiler/input/* &&  rm /home/compiler/output/*"
docker exec -i gcc_compiler$1 sh -c "echo ""No Errors"" > /home/compiler/output/error.txt" 
docker cp input$1.c gcc_compiler$1:/home/compiler/input/input.c && docker cp timeout_script.sh gcc_compiler$1:/home/compiler/input/timeout_script.sh && docker cp stdin.txt gcc_compiler$1:/home/compiler/input/stdin.txt
docker exec -i gcc_compiler$1 sh -c "chmod u+x /home/compiler/input/timeout_script.sh" 
docker exec -i gcc_compiler$1 sh -c "if gcc  -std=c99 -D_GNU_SOURCE /home/compiler/input/input.c -o /home/compiler/input/input_compiled$1; then echo ""Compile Successful""> /home/compiler/output/status.txt; else echo ""Compile Error"" > /home/compiler/output/status.txt && gcc -std=c99 -D_GNU_SOURCE /home/compiler/input/input.c -o /home/compiler/input/input_compiled$1 2> /home/compiler/output/error.txt; fi " 
docker exec -i gcc_compiler$1 sh -c "./home/compiler/input/timeout_script.sh $1"
docker stop gcc_compiler$1  && docker cp gcc_compiler$1:/home/compiler/output/output.txt /home/thassya/Documentos/Igor/output$1.txt && docker cp gcc_compiler$1:/home/compiler/output/status.txt /home/thassya/Documentos/Igor/status$1.txt && docker cp gcc_compiler$1:/home/compiler/output/error.txt /home/thassya/Documentos/Igor/error$1.txt && docker rm gcc_compiler$1