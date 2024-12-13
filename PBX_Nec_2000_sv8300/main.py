import socket
import time
import os

from helpers.client_request_to_server import *
from helpers.parser_smdr_nec import *
from helpers.parser_string_ring import add_sql_table
from helpers.create_sql_tables import *


def station_nec(ip_adress_station):

    seq = 0
    save = []
    check_table()
    client = socket.socket()
    client.connect((ip_adress_station, 60010))
    print('Connect station', ip_adress_station,'...')
        
    
    while True:
        time.sleep(9)  # Отправляем запрос на сервер каждые 9 sec

        print('_________________________________________________________________________________________________________________________________________________________________________ ')

        client.send(request_on_data())
        print('Отправляем запрос серверу: ', request_on_data())        

        data = client.recv(1024) #получаем строку в байтовом виде (сервер послал ответ на запрос №2)
        print('Принимаемые данные от сервера(в Bytes): ', data)
        data_ascii = data.decode('utf-8',errors='ignore') #преобразуем в строку ASCII
        print('Принимаемые данные от сервера(в ASCII): ', data_ascii)
        data_slice = slice_data(data_ascii) #парсим нашу строчку в "нормальный вид" -_-
        print('Принимаемые данные от сервера(в Normal view): ',  data_slice)

        print('Последовательность: ', seq)


        # Обрабатываем исключения и добавляем в базу SQL_lite  
        if data != b'\x16300003002\x00':
            if save != data_slice and add_sql_table(data_slice)[5] != '': # and add_sql_table(data_slice)[5] != 'Внутренний'
                print('Данные добавленные в базу: ',add_sql_table(data_slice))
                insert_to_table(add_sql_table(data_slice))
                save = data_slice 

        client.send(response_client_from_PBX(seq))
        print('Отправляем запрос серверу: ',response_client_from_PBX(seq))
        print(len(data_ascii))
        
        client.send(request_monitor())  
        get_last_data = client.recv(1024)   

        if len(data_ascii) <= 11:
            continue
        else: 
            seq = seq + 1
            if seq == 10:
                seq = 0


if __name__ == "__main__":
    station_nec(os.environ['IP_ADRESS'])


