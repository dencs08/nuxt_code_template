# Supabase dump to cloud

## command:

PGPASSWORD='<DBPASSWORD>' psql -h <DBHOST> -p 6543 -U <DBUSER> -d <DBNAME> < dump.sql
