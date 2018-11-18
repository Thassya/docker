
INPUTFILE=input_compiled$1
	timeout 1 ./home/compiler/input/$INPUTFILE < ./home/compiler/input/stdin.txt > /home/compiler/output/retorno.txt 2>&1;
	if [ $? = 124 ] ; then	    
	    printf "sim" > /home/compiler/output/timeout.txt
	else  
	    printf "nao" > /home/compiler/output/timeout.txt
fi

