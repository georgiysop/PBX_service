#This file parser asckii string PBX to add list

from datetime import datetime
import time
import math


#example one string
#test = ['A', '004', '004', '0', '12', '2610 ', ['16', '10', '23', '10', '45', '27'], ['16', '10', '23', '10', '50', '32'], '000', '004', '004', '89957518111                     ']

def add_sql_table(data_slice):
    list_from_database = []
    
    if data_slice[6][2] != '':
        fmt = '%Y-%m-%d %H:%M:%S'
        d1 = datetime.strptime('20' + data_slice[6][2] + '-' + data_slice[6][1] + '-' + data_slice[6][0] + ' ' + data_slice[6][3] + ":" + data_slice[6][4] + ":" + data_slice[6][5], fmt)
        d2 = datetime.strptime('20' + data_slice[7][2] + '-' + data_slice[7][1] + '-' + data_slice[7][0] + ' ' + data_slice[7][3] + ":" + data_slice[7][4] + ":" + data_slice[7][5], fmt)
        
        # Convert to Unix timestamp
        d1_ts = time.mktime(d1.timetuple())
        d2_ts = time.mktime(d2.timetuple())

        #add date_start and date_time
        #datte = str(data_slice[6][0]+"."+data_slice[6][1]+"."+data_slice[6][2])
        datte = str(d1)
        list_from_database.append(datte)

        #add date_time_start
        #datte = str(data_slice[6][3]+":"+data_slice[6][4]+":"+data_slice[6][5])
        #list_from_database.append(datte)

        #add date_time_end
        #datte = str(data_slice[7][3]+":"+data_slice[7][4]+":"+data_slice[7][5])
        datte = str(d2)
        list_from_database.append(datte)
    else:
        list_from_database.append('')
        list_from_database.append('')
      
     #add amount_of_time  
    if data_slice[6][2] != '':
        list_from_database.append(math.ceil(int(d2_ts - d1_ts)/60))
    else:
        list_from_database.append('')
        
    #add number_1
    list_from_database.append(data_slice[5].strip())

    #add number_2
    list_from_database.append("".join(data_slice[11].strip().split()))

    #add type_ring
    if data_slice[6][2] != '':
        if data_slice[11][0:1] == '0'.strip():
            list_from_database.append('Внутренний')
        elif data_slice[11][0:2] == '88':
            list_from_database.append('Межгородской')
        elif data_slice[11][0:2] == '89':
            list_from_database.append('Мобильный')
        else:
            list_from_database.append('Городской')
    else:
        list_from_database.append('')

    return list_from_database

#print(add_sql_table(test))
#['2023-10-16 10:45:27', '2023-10-16 10:50:32', 5.08, '2610', '89957518111', 'Мобильный']
