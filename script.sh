docker start gcc_compiler
docker exec -it gcc_compiler sh -c "rm /home/compiler/input/* &&  rm /home/compiler/output/*"
docker cp input.c gcc_compiler:/home/compiler/input/input.c && docker cp timeout_script.sh gcc_compiler:/home/compiler/input/timeout_script.sh
docker exec -it gcc_compiler sh -c "chmod 755 /home/compiler/input/timeout_script.sh" 
docker exec -it gcc_compiler sh -c "if gcc /home/compiler/input/input.c -o /home/compiler/input/input_compiled; then echo ""Compile Successful""> /home/compiler/output/status.txt; else echo ""Compile Error"" > /home/compiler/output/status.txt; fi " 
docker exec -it gcc_compiler sh -c "./home/compiler/input/timeout_script.sh"
docker stop gcc_compiler  && docker cp gcc_compiler:/home/compiler/output/output.txt /home/thassya/Documentos/Docker/ && docker cp gcc_compiler:/home/compiler/output/status.txt /home/thassya/Documentos/Docker/ 
 