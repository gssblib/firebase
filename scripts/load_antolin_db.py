import codecs
import csv
import datetime
import getpass
import optparse
import pymysql
import sys

parser = optparse.OptionParser(
    './load_antolin_db.py [-d <dbname>] [-u user] [-p password] csv-file')
parser.add_option('-d', '--database', dest='database', default='spils',
                  help='The database to store the data in.')
parser.add_option('-u', '--username', dest='username', default='gssb',
                  help='The username for the database.')
parser.add_option('-p', '--password', dest='password',
                  help='The password for the database.')

insert_sql = (
    u"INSERT INTO antolin "
    u"(author, title, publisher, isbn10, isbn10_formatted, isbn13, "
    u"isbn13_formatted, book_id, available_since, grade, num_read) "
    u"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

def main(argv=sys.argv[1:]):
    opts, args = parser.parse_args(argv)

    if not opts.password:
        opts.password = getpass.getpass()

    conn = pymysql.connect(
        user=opts.username,
        password=opts.password,
        database=opts.database,
        charset='utf8')
    cur = conn.cursor()

    csv_io = open(args[0], 'r')
    reader = csv.reader(csv_io, delimiter=";", quotechar='"')
    # Drop header row.
    reader.next()

    for idx, row in enumerate(reader):
        if idx % 100 == 0:
            sys.stdout.write('.')
            sys.stdout.flush()
        (author, title, publisher, isbn10, since, grade, read,
         isbn13, isbn10f, isbn13f, bookid) = row
        day, month, year = [int(p) for p in since.split('.')]
        # Some entries are bad.
        if len(isbn13) != 13:
            isbn13 = None
        if len(isbn13f) != 17:
            isbn13f = None
        if len(isbn10) != 10:
            isbn10 = None
        if len(isbn10f) != 13:
            isbn10f = None
        try:
            cur.execute(
                insert_sql,
                (author.decode('utf-8'),
                 title.decode('utf-8'),
                 publisher.decode('utf-8'),
                 isbn10, isbn10f, isbn13, isbn13f, bookid,
                 datetime.date(year, month, day),
                 grade, read
                )
            )
        except Exception as err:
            import pdb; pdb.set_trace()
    conn.commit()
    print

if __name__ == '__main__':
    main()

