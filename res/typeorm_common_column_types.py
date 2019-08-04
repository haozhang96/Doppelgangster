mysql_mariadb = "bit, int, integer, tinyint, smallint, mediumint, bigint, float, double, double precision, dec, decimal, numeric, fixed, bool, boolean, date, datetime, timestamp, time, year, char, nchar, national char, varchar, nvarchar, national varchar, text, tinytext, mediumtext, blob, longtext, tinyblob, mediumblob, longblob, enum, json, binary, varbinary, geometry, point, linestring, polygon, multipoint, multilinestring, multipolygon, geometrycollection"
postgres = "int, int2, int4, int8, smallint, integer, bigint, decimal, numeric, real, float, float4, float8, double precision, money, character varying, varchar, character, char, text, citext, hstore, bytea, bit, varbit, bit varying, timetz, timestamptz, timestamp, timestamp without time zone, timestamp with time zone, date, time, time without time zone, time with time zone, interval, bool, boolean, enum, point, line, lseg, box, path, polygon, circle, cidr, inet, macaddr, tsvector, tsquery, uuid, xml, json, jsonb, int4range, int8range, numrange, tsrange, tstzrange, daterange, geometry, geography"
cockroachdb = "array, bool, boolean, bytes, bytea, blob, date, numeric, decimal, dec, float, float4, float8, double precision, real, inet, int, integer, int2, int8, int64, smallint, bigint, interval, string, character varying, character, char, char varying, varchar, text, time, time without time zone, timestamp, timestamptz, timestamp without time zone, timestamp with time zone, json, jsonb, uuid"
sqlite = "int, int2, int8, integer, tinyint, smallint, mediumint, bigint, decimal, numeric, float, double, real, double precision, datetime, varying character, character, native character, varchar, nchar, nvarchar2, unsigned big int, boolean, blob, text, clob, date"
mssql = "int, bigint, bit, decimal, money, numeric, smallint, smallmoney, tinyint, float, real, date, datetime2, datetime, datetimeoffset, smalldatetime, time, char, varchar, text, nchar, nvarchar, ntext, binary, image, varbinary, hierarchyid, sql_variant, timestamp, uniqueidentifier, xml, geometry, geography, rowversion"
oracle = "char, nchar, nvarchar2, varchar2, long, raw, long raw, number, numeric, float, dec, decimal, integer, int, smallint, real, double precision, date, timestamp, timestamp with time zone, timestamp with local time zone, interval year to month, interval day to second, bfile, blob, clob, nclob, rowid, urowid"

print(
    set(mysql_mariadb.split(", "))
    & set(postgres.split(", "))
    & set(cockroachdb.split(", "))
    & set(sqlite.split(", "))
    & set(mssql.split(", "))
    & set(oracle.split(", "))
)
