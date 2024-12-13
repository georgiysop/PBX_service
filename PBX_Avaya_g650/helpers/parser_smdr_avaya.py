# 05222024 142728 142731 7   9 451            89957518111            1001             2       013 4

def slice_data(smdr_data):
    data = smdr_data
    list_from_database = []
    list_from_database.append([data[0:2],data[2:4],data[4:8]]) #date_start
    list_from_database.append([data[9:11],data[11:13],data[13:15]]) #time_start
    list_from_database.append([data[16:18],data[18:20],data[20:22]]) #time_end

    next_data_to_list = data[23:].split()
    for x in next_data_to_list:
        list_from_database.append(x)
        
    return   list_from_database 


#результат: [['05', '22', '2024'], ['14', '27', '28'], ['14', '27', '31'], '7', '9', '451', '89957518111', '1001', '2', '013', '4'] 