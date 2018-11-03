FROM alpine:3.8 AS gccalpine
MAINTAINER Thassya Abreu

RUN cd /home
RUN mkdir compiler
RUN cd /compiler
RUN mkdir /input 
RUN mkdir /output
RUN cd /

COPY script.sh /script.sh
COPY timeout_script.sh /timeout_script.sh
COPY createjson_script.sh /createjson_script

RUN chmod u+x script.sh

#rodando a imagem como um non-root user (assim como no heroku)
RUN adduser -D myuser
USER myuser

CMD ["./script.sh"]