#!/bin/bash
docker-compose build ladevi_ventas_front
if [ $? -ne 0 ] ; then echo "error al correr tests o compilar" ; exit 1 ; fi
docker tag ladevi_ventas_front asmx1986/greencode:ladevi_ventas_front_latest
docker push asmx1986/greencode:ladevi_ventas_front_latest
docker image prune -f
