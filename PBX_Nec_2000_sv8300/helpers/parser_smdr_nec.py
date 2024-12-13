#test_data = '2001350050!KA0040040122610  10161045271016105032          01200000400489957518111                     0000                  23230          '

def get_sequnce_data(seq):
    return int(seq)

#Former NEAX 2400 IMS Format (abbreviated format)
def slice_data(smdr_data):
    data = smdr_data[12:]
    
    list_from_database = []
    list_from_database.append(data[2:3]) #Type of record
    list_from_database.append(data[3:6]) #TrunkOut
    list_from_database.append(data[6:9]) #TrunkInc
    list_from_database.append(data[9:10]) #Id
    list_from_database.append(data[10:12]) #Tenant 
    list_from_database.append(data[12:17]) #Called 
    
    list_from_database.append([data[20:22],data[18:20],data[114:116],data[22:24],data[24:26],data[26:28]]) #CvsStart.TIME
    list_from_database.append([data[30:32],data[28:30],data[116:118],data[32:34],data[34:36],data[36:38]], ) #CvsEnd.TIME
    
    list_from_database.append(data[51:54]) #Condition 
    
    list_from_database.append(data[54:57]) #Route1
    list_from_database.append(data[57:60]) #Route2
    list_from_database.append(data[60:92]) #Phone 
    return   list_from_database 

#результат: ['A', '004', '004', '0', '12', '2610 ', ['16', '10', '23', '10', '45', '27'], ['16', '10', '23', '10', '50', '32'], '000', '004', '004', '89957518111                     ']  





#or (Former NEAX 2400 IMS Format)




#def slice_data(data):
    #list_from_database = []
    #list_from_database.append(data[2:3]) #
    #list_from_database.append(data[3:6]) #TrunkOut
    #list_from_database.append(data[6:9]) #TrunkInc
    #list_from_database.append(data[9:10]) #Id
    #list_from_database.append(data[10:12]) #Tenant 
    #list_from_database.append(data[12:17]) #Called 
    
    #list_from_database.append(data[18:20]) #CvsStart.Month
    #list_from_database.append(data[20:22]) #CvsStart.Day
    #list_from_database.append(data[22:24]) #CvsStart.Hour
    #list_from_database.append(data[24:26]) #CvsStart.Minute
    #list_from_database.append(data[26:28]) #CvsStart.Second
    
    #list_from_database.append(data[28:30]) #CvsEnd.Month
    #list_from_database.append(data[30:32]) #CvsEnd.Day
    #list_from_database.append(data[32:34]) #CvsEnd.Hour
    #list_from_database.append(data[34:36]) #CvsEnd.Minute
    #list_from_database.append(data[36:38]) #CvsEnd.Second
    
    #account code[38:48]
    #Tenant[48:51]
    
    #list_from_database.append(data[51:54]) #Condition 
    #list_from_database.append(data[54:57]) #Route1
    #list_from_database.append(data[57:60]) #Route2
    #list_from_database.append(data[60:92]) #Phone 
    
    #call metering[92:96]
    #calling office[96:100]
    #billing office[100:104]
    #authorization code[104:114]
    
    #list_from_database.append(data[114:116]) #CvsStart.Year
    #list_from_database.append(data[116:118]) #CvsEnd.Year

    #return   list_from_database 
    
    
    
     
#or (Extended NEAX 2400 IMS Format)




#def slice_data(data):
    #list_from_database = []
    #list_from_database.append(data[2:3]) #
    #list_from_database.append(data[3:6]) #TrunkOut
    #list_from_database.append(data[6:9]) #TrunkInc
    #list_from_database.append(data[9:10]) #Id
    #list_from_database.append(data[10:12]) #Tenant 
    #list_from_database.append(data[12:17]) #Called 
    
    #list_from_database.append(data[18:20]) #CvsStart.Month
    #list_from_database.append(data[20:22]) #CvsStart.Day
    #list_from_database.append(data[22:24]) #CvsStart.Hour
    #list_from_database.append(data[24:26]) #CvsStart.Minute
    #list_from_database.append(data[26:28]) #CvsStart.Second
    
    #list_from_database.append(data[28:30]) #CvsEnd.Month
    #list_from_database.append(data[30:32]) #CvsEnd.Day
    #list_from_database.append(data[32:34]) #CvsEnd.Hour
    #list_from_database.append(data[34:36]) #CvsEnd.Minute
    #list_from_database.append(data[36:38]) #CvsEnd.Second
    
    #account code[38:48]
    #Tenant[48:51]
    
    #list_from_database.append(data[51:54]) #Condition 
    #list_from_database.append(data[54:57]) #Route1
    #list_from_database.append(data[57:60]) #Route2
    #list_from_database.append(data[60:92]) #Phone 
    
    #call metering[92:96]
    #calling office[96:100]
    #billing office[100:104]
    #authorization code[104:114]
    
    #list_from_database.append(data[114:116]) #CvsStart.Year
    #list_from_database.append(data[116:118]) #CvsEnd.Year