import sqlite3

#Check tables and create tables
def check_table():
    with sqlite3.connect('../PBX_SQLite/database.db') as connection:
        cursor = connection.cursor()
        
        if (cursor.execute("""SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Rings'; """)).fetchall()  == [(0,)]:
            cursor.execute('''
                    CREATE TABLE Rings
            (
                ring_id INTEGER PRIMARY KEY,
                date_start TEXT NOT NULL,
                date_time_start TEXT NOT NULL,
                amount_of_time REAL NOT NULL,
                number_1 TEXT NOT NULL,
                number_2 TEXT NOT NULL,
                type_ring TEXT NOT NULL
            );
            ''')
            
        if (cursor.execute("""SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Tariffs'; """)).fetchall()  == [(0,)]:
            cursor.execute('''
                    CREATE TABLE Tariffs
            (
                tariff_id INTEGER PRIMARY KEY,
                description TEXT NOT NULL,
                price REAL
            );
            ''')  
            
        if (cursor.execute("""SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Abonents'; """)).fetchall()  == [(0,)]:
            cursor.execute('''
                    CREATE TABLE Abonents
            (
                abonent_id INTEGER PRIMARY KEY,
                last_name TEXT,
                abonent_number TEXT NOT NULL,
                convert_number TEXT
            );
            ''')  

        if (cursor.execute("""SELECT count(*) FROM sqlite_master WHERE type='table' AND name='Accounts'; """)).fetchall()  == [(0,)]:
            cursor.execute('''
                    CREATE TABLE Accounts
            (
                account_id INTEGER PRIMARY KEY,
                login TEXT NOT NULL,
                password TEXT NOT NULL,
                hash TEXT
            );
            ''')
            cursor.execute('''INSERT INTO Accounts(login,password,hash) VALUES ('admin','admin', ''); ''')


#add row_data to table Rings
def insert_to_table(listt):
    with sqlite3.connect('../PBX_SQLite/database.db') as connection:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO Rings(date_start, date_time_start, amount_of_time, number_1, number_2, type_ring) VALUES (?, ?, ?, ?, ?, ?)", (listt[0], listt[1], listt[2], listt[3], listt[4], listt[5]))



#check_table()
# insert_to_table()    
# insert_exeltable_to_sqlite()


