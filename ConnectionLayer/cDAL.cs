using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using CRUD_Training.Models;

namespace CRUD_Training.ConnectionLayer
{
    public class cDAL
    {
        private readonly string _connectionString;

        public cDAL(IConfiguration config) 
        {
            //Get file path from config
            string connPath = config["Path:ConnPath"];

            if (string.IsNullOrWhiteSpace(connPath) || !File.Exists(connPath))
            {
                throw new FileNotFoundException($"Connection File not found at path: {connPath}");
            }
            
            //Read the file content 
            _connectionString = File.ReadAllText(connPath).Trim();

            if (string.IsNullOrWhiteSpace(_connectionString))
            {
                throw new InvalidOperationException($"Connection string in the file is empty");
            }
        }

        public int Insert(string tableName, Dictionary<string, object> columnValues)
        {
            if (string.IsNullOrWhiteSpace(tableName))
            {
                throw new ArgumentException("Table name cannot be null.", nameof(tableName));
            }

            if (columnValues == null || columnValues.Count == 0)
            {
                throw new ArgumentException("Column Values cannot be null.", nameof(columnValues));
            }

            //To Generate Column Names and Parameterized values
            string columnNames = string.Join(", ", columnValues.Keys);
            string paramNames = string.Join(", ", columnValues.Keys.Select(key => "@" + key));

            string query = $"INSERT INTO {tableName} ({columnNames}) VALUES ({paramNames})";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    //add params to the query (here kvp is KeyValueParameters)
                    foreach (var kvp in columnValues)
                    {
                        command.Parameters.AddWithValue("@" + kvp.Key, kvp.Value ?? DBNull.Value);
                    }

                    connection.Open();
                    return command.ExecuteNonQuery(); //This will return number of rows affected
                }
            }
        }

        // Generic GetData Function
        public List<T> GetData<T>(string tableName)
        {
            if (string.IsNullOrWhiteSpace(tableName))
            {
                throw new ArgumentException("Table name cannot be null or empty.", nameof(tableName));
            }

            List<T> resultList = new List<T>();

            string query = $"SELECT * FROM {tableName}";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            T obj = Activator.CreateInstance<T>();

                            // Iterate only over properties that are part of the database (exclude non-database properties)
                            foreach (PropertyInfo prop in typeof(T).GetProperties())
                            {
                                // Skip properties that are not part of the database table
                                if (!reader.GetSchemaTable()
                                           .Rows
                                           .Cast<DataRow>()
                                           .Any(row => row["ColumnName"].ToString() == prop.Name))
                                {
                                    continue;
                                }

                                // Map database values to properties
                                if (!reader.IsDBNull(reader.GetOrdinal(prop.Name)))
                                {
                                    prop.SetValue(obj, reader[prop.Name]);
                                }
                            }

                            resultList.Add(obj);
                        }
                    }
                }
            }

            return resultList;
        }

        public int Update(string tableName, Dictionary<string, object> columnValues, string condition)
        {
            if (string.IsNullOrWhiteSpace(tableName))
            {
                throw new ArgumentException("Table name cannot be null.", nameof(tableName));
            }

            if (columnValues == null || columnValues.Count == 0)
            {
                throw new ArgumentException("Column Values cannot be null.", nameof(columnValues));
            }

            if (string.IsNullOrWhiteSpace(condition))
            {
                throw new ArgumentException("Condition cannot be null.", nameof(condition));
            }

            //To Generate Column Names and Parameterized values
            //string columnNames = string.Join(", ", columnValues.Keys);
            //string paramNames = string.Join(", ", columnValues.Keys.Select(key => "@" + key));
            string setClause = string.Join(", ",columnValues.Keys.Select(key => $"{key} = @{key}"));

            string query = $"UPDATE {tableName} SET {setClause} WHERE {condition} ";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    //add params to the query (here kvp is KeyValueParameters)
                    foreach (var kvp in columnValues)
                    {
                        command.Parameters.AddWithValue("@" + kvp.Key, kvp.Value ?? DBNull.Value);
                    }

                    connection.Open();
                    return command.ExecuteNonQuery(); //This will return number of rows affected
                }
            }
        }

        public int Delete(string tableName, string condition)
        {
            if (string.IsNullOrWhiteSpace(tableName))
            {
                throw new ArgumentException("Table name cannot be null.", nameof(tableName));
            }

            if (string.IsNullOrWhiteSpace(condition))
            {
                throw new ArgumentException("Condition cannot be null", nameof(condition));
            }

            string query = $"DELETE FROM {tableName} WHERE {condition}";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query,connection))
                {
                    connection.Open();
                    return command.ExecuteNonQuery(); // Returns number of rows deleted
                }
            }
        }
    }
}
