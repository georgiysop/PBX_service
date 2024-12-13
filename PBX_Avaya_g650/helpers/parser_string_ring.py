#This file parser asckii string PBX to add list

from datetime import datetime
import time
import math


#example one string
#test = [['05', '22', '2024'], ['14', '27', '28'], ['14', '27', '31'], '7', '9', '451', '89957518111', '1001', '2', '013', '4'] 

def add_sql_table(data_slice):
    list_from_database = []
    
    fmt = '%Y-%m-%d %H:%M:%S'
    d1 = datetime.strptime(data_slice[0][2] + '-' + data_slice[0][0] + '-' + data_slice[0][1] + ' ' + data_slice[1][0] + ":" + data_slice[1][1] + ":" + data_slice[1][2], fmt)
    d2 = datetime.strptime(data_slice[0][2] + '-' + data_slice[0][0] + '-' + data_slice[0][1] + ' ' + data_slice[2][0] + ":" + data_slice[2][1] + ":" + data_slice[2][2], fmt)
    
    # Convert to Unix timestamp
    d1_ts = time.mktime(d1.timetuple())
    d2_ts = time.mktime(d2.timetuple())

    #add date_time_start
    datte = str(d1)
    list_from_database.append(datte)
    
    #add date_time_end
    datte = str(d2)
    list_from_database.append(datte)
    
    #add amount_of_time  
    list_from_database.append(math.ceil(int(d2_ts - d1_ts)/60))

        
    #add number_1
    list_from_database.append(data_slice[7])

    #add number_2
    list_from_database.append(data_slice[6])

    #add type_ring
    if len(data_slice[6]) <= 7:
        list_from_database.append('Городской')
    elif data_slice[6][0:2] == '89':
        list_from_database.append('Мобильный')
    elif len(data_slice[6]) >=11 and data_slice[6][0] == '8' and data_slice[6][1] != 9:
        list_from_database.append('Межгородской')
    else:
        list_from_database.append('неопр')
    return list_from_database

#print(add_sql_table(test))
#['2023-10-16 10:45:27', '2023-10-16 10:50:32', 5.08, '1001', '89957518111', 'Мобильный']
