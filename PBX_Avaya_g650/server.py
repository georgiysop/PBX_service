# -*- coding: utf-8 -*-

import socket
import time
import os

from helpers.parser_smdr_avaya import *
from helpers.parser_string_ring import add_sql_table
from helpers.create_sql_tables import *


server = socket.socket()
server.bind((os.environ['IP_ADRESS'], 6001))
server.listen(1)
conn, addr = server.accept()


data = conn.recv(1024)
#Записываем все записи из оперативной памяти
while len(data) > 80:
    print('_________________________________________________________________________________________________________________________________________________________________________ ')
    print('Принимаемые данные от сервера(в Bytes): ', data)
    
    data_ascii = data.decode('utf-8',errors='ignore') #преобразуем в строку ASCII
    print('Принимаемые данные от сервера(в ASCII): ', data_ascii)
    
    data_slice = slice_data(data_ascii) #парсим нашу строчку в "нормальный вид" -_-
    print('Принимаемые данные от сервера(в Normal view): ',  data_slice)
    
    print('Данные добавленные в базу: ',add_sql_table(data_slice))
    insert_to_table(add_sql_table(data_slice))

    data = conn.recv(1024)
    
    
#Информация о подключении к клиенту
data_ascii = data.decode('utf-8',errors='ignore') #преобразуем в строку ASCII
print("Ждем запросов от ATC ...")
print("Время подключения:", data_ascii[0:12])
    

#Ождиаем запросов от клиента
try:
    while True:
        data = conn.recv(1024)
        print('_________________________________________________________________________________________________________________________________________________________________________ ')
        print('Принимаемые данные от сервера(в Bytes): ', data)

        data_ascii = data.decode('utf-8',errors='ignore') #преобразуем в строку ASCII
        print('Принимаемые данные от сервера(в ASCII): ', data_ascii)
        
        data_slice = slice_data(data_ascii) #парсим нашу строчку в "нормальный вид" -_-
        print('Принимаемые данные от сервера(в Normal view): ',  data_slice)
        
        print('Данные добавленные в базу: ',add_sql_table(data_slice))
        insert_to_table(add_sql_table(data_slice))

        time.sleep(1)  # Отправляем запрос на сервер каждые 2 секунды
except:
    print('Отключаемся ...')
    conn.close()
