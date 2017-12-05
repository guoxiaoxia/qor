module.exports = {
	cache: [
		{
			media:"memcache",
			host:"127.0.0.1",
			port:11211
		}
	],
	persistence: [
		{
			media: "mysql",
			host: "127.0.0.1",
			port: 3306,
			user: "root",
			password: "",
			database: "db_test"
		},
		{
			media: "mysql",
			host: "127.0.0.1",
			port: 3306,
			user: "root",
			password: "",
			database: "db_test"
		}
	]
}