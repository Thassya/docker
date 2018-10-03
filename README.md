## Docker ##
Simples instância de Docker para compilar arquivos C.

## Como Instalar ##

* siga estes passos no terminal: 
    - docker pull ubuntu:14.04
    - docker run -i -t [id_imagem] /bin/bash
    - apt-get update
    - apt-get install -y gcc
    - apt-get install -y software-properties-common
    - cd /home
    - mkdir compiler
    - cd /compiler
    - mkdir /input
    - mkdir /output
    - cd /
    - exit
    - docker commit [id_container] gcc
    - docker run -i -t --name gcc_compiler  gcc 
    - chmod chmod u+x script.sh
    
    * é necessário instalar o pacote Cors do node. (npm install cors)
    * node index.js para inicialiar o projeto.