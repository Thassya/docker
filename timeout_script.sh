
INPUTFILE=input_compiled$1
	timeout 1 ./home/compiler/input/$INPUTFILE < ./home/compiler/input/stdin.txt > /home/compiler/output/retorno.txt 2> /home/compiler/output/validacao.txt;
	if [ $? = 124 ] ; then
	    
	    echo "\",\"timeout\":\"Sim" > /home/compiler/output/retorno.txt
	
	fi

