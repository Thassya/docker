
INPUTFILE=input_compiled$1
	timeout 1 ./home/compiler/input/$INPUTFILE < ./home/compiler/input/stdin.txt > /home/compiler/output/output.txt;
	if [ $? = 124 ] ; then
	    echo "TimeOut" > /home/compiler/output/status.txt
	    echo "TimeOut" > /home/compiler/output/output.txt
	
	fi

