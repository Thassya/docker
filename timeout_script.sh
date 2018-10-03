	timeout 3 ./home/compiler/input/input_compiled > /home/compiler/output/output.txt;
	if [ $? = 124 ] ; then
	    echo "Time Out" > /home/compiler/output/status.txt
	    echo "Time Out" > /home/compiler/output/output.txt
	
	fi
