import io
import binascii


# Идентификатор запроса данных 1 / запрос на получение данных с мини-АТС
def request_on_data():
	data = ['16', '31', '30', '30', '30', '30', '32', '30', '30', 'FC'] #базовый запрос на получение данных с АТС
	data =''.join(data) #сплитуем наш список в строку без пробелов
	data = io.BytesIO(bytes.fromhex(data)).getvalue() #переводим строку в байты
	return data

# Идентификатор ответа клиента 4 / ответ клиента
def response_client_from_PBX(seq):    
	data = ['16', '34', '30', '30', '30', '30', '34', '30', '30', seq+1, '06', 'C8'] 
	# if data[9] >= 9: #проверяем, чтобы число было не больше или равно 10, так как шест. число представиться некорректно 10 -> 3130 (неправильно!)
	# 	data[9] = 0	
	data[9] = str(data[9]) #переводим в строку, чтобы потом легче перевести шестнадц. число
	data[9] = binascii.hexlify(data[9].encode()).decode() #перевод в 16-иричное число
	data =''.join(data) #сплитуем наш список в строку без пробелов
	data = io.BytesIO(bytes.fromhex(data)).getvalue() #переводим строку в байты
	return data

# Идентификатор ответа клиента 5 / ответ клиента
def request_monitor():        
	data = ['16', '35', '30', '30', '30', '30', '35', '30', '30', '30', '06', 'F9'] # базовый запрос на мониторинга
	data =''.join(data) #сплитуем наш список в строку без пробелов
	data = io.BytesIO(bytes.fromhex(data)).getvalue() #переводим строку в байты
	return data

# Отключение соединения с индитификатором 6
def request_disconnect_Client():
	data = ['16', '36', '30', '30', '30', '30', '33', '30', '30', '06', 'FC'] #базовый запрос на отключение
	data =''.join(data) #сплитуем наш список в строку без пробелов
	data = io.BytesIO(bytes.fromhex(data)).getvalue() #переводим строку в байты
	return data



#request_on_data
#принимает в ответ данные
#response_client_from_PBX    тут же перебираем seq
#request_on_data


# conversion_table = {0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 
#                     5: '5', 6: '6', 7: '7', 
#                     8: '8', 9: '9', 10: 'A', 11: 'B', 12: 'C', 
#                     13: 'D', 14: 'E', 15: 'F'} 
  
  
# # function which converts decimal value 
# # to hexadecimal value 
# def decimalToHexadecimal(decimal): 
#     hexadecimal = '' 
#     while(decimal > 0): 
#         remainder = decimal % 16
#         hexadecimal = conversion_table[remainder] + hexadecimal 
#         decimal = decimal // 16
  
#     return hexadecimal 
# request_on_data[9] = decimalToHexadecimal(request_on_data[9])


